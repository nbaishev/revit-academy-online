import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'ustabim_cookie_consent';
const COOKIE_CONSENT_VALUE = 'accepted';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const isAccepted = window.localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_VALUE;
      setIsVisible(!isAccepted);
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VALUE);
    } catch {
      // Ignore write errors and just hide banner for current session.
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Мы используем cookies, чтобы сайт работал корректно и был удобнее для вас.
        </p>
        <Button type="button" size="sm" onClick={handleAccept} className="w-full sm:w-auto">
          Ок
        </Button>
      </div>
    </div>
  );
}
