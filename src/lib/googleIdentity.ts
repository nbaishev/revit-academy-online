const GIS_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise: Promise<void> | null = null;

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

  return new Promise((resolve, reject) => {
    const googleObj = (window as any).google;
    if (!googleObj?.accounts?.id) {
      reject(new Error('Google Identity not available'));
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
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    googleObj.accounts.id.prompt((notification: any) => {
      if (finished) return;
      const notDisplayed = notification.isNotDisplayed && notification.isNotDisplayed();
      const skipped = notification.isSkippedMoment && notification.isSkippedMoment();
      if (notDisplayed || skipped) {
        reject(new Error('Google login was cancelled'));
      }
    });
  });
}
