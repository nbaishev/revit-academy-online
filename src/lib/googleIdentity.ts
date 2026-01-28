const GIS_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise: Promise<void> | null = null;
let promptPromise: Promise<string> | null = null;

const loadGoogleScript = () => {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${GIS_SRC}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export async function getGoogleIdToken(clientId: string): Promise<string> {
  if (!clientId) {
    throw new Error('Google Client ID is not configured');
  }
  await loadGoogleScript();

  if (promptPromise) return promptPromise;

  promptPromise = new Promise((resolve, reject) => {
    const googleObj = (window as any).google;
    if (!googleObj?.accounts?.id) {
      reject(new Error('Google Identity not available'));
      promptPromise = null;
      return;
    }

    let finished = false;

    googleObj.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response.credential) {
          finished = true;
          resolve(response.credential);
        } else {
          reject(new Error('No credential returned from Google'));
        }
      },
      // Required for upcoming FedCM changes and to reduce silent failures.
      use_fedcm_for_prompt: true,
      state_cookie_domain: window.location.hostname,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    googleObj.accounts.id.prompt((notification: any) => {
      if (finished) return;
      const notDisplayed = notification.getNotDisplayedReason?.() || (notification.isNotDisplayed && notification.isNotDisplayed());
      const skipped = notification.getSkippedReason?.() || (notification.isSkippedMoment && notification.isSkippedMoment());
      if (notDisplayed || skipped) {
        finished = true;
        promptPromise = null;
        reject(new Error(`Google login was cancelled (${notDisplayed || skipped})`));
      }
    });
  });

  return promptPromise.finally(() => {
    promptPromise = null;
  });
}

export async function getGoogleAuthCode(clientId: string, redirectUri?: string): Promise<string> {
  if (!clientId) {
    throw new Error('Google Client ID is not configured');
  }
  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    const googleObj = (window as any).google;
    if (!googleObj?.accounts?.oauth2?.initCodeClient) {
      reject(new Error('Google OAuth2 code client not available'));
      return;
    }
    let finished = false;
    let focusTimeout: number | null = null;
    let overallTimeout: number | null = null;

    const cleanup = () => {
      window.removeEventListener('focus', handleFocus);
      if (focusTimeout) window.clearTimeout(focusTimeout);
      if (overallTimeout) window.clearTimeout(overallTimeout);
    };

    const finish = (fn: (value: any) => void, value: any) => {
      if (finished) return;
      finished = true;
      cleanup();
      fn(value);
    };

    const handleFocus = () => {
      if (finished) return;
      if (focusTimeout) window.clearTimeout(focusTimeout);
      // Give the callback a moment to arrive after the popup closes.
      focusTimeout = window.setTimeout(() => {
        if (!finished) {
          finish(reject, new Error('Google login was cancelled'));
        }
      }, 800);
    };

    const codeClient = googleObj.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'openid email profile',
      ux_mode: 'popup',
      // For SPA popup flow, Google recommends "postmessage" redirect to avoid URL mismatch.
      redirect_uri: redirectUri || 'postmessage',
      callback: (resp: any) => {
        if (resp?.code) {
          finish(resolve, resp.code);
          return;
        }
        finish(reject, new Error('Google did not return auth code'));
      },
      error_callback: (err: any) => {
        const message =
          err?.error || err?.message || 'Google login failed';
        finish(reject, new Error(message));
      },
    });
    window.addEventListener('focus', handleFocus);
    overallTimeout = window.setTimeout(() => {
      if (!finished) {
        finish(reject, new Error('Google login timed out'));
      }
    }, 120_000);

    try {
      codeClient.requestCode();
    } catch (error) {
      finish(reject, error instanceof Error ? error : new Error('Google login failed'));
    }
  });
}
