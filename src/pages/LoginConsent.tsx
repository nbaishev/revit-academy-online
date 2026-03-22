import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Layout } from '@/components/layout/Layout';
import { LegalConsentText } from '@/components/legal/LegalConsentText';
import { useAuth } from '@/contexts/AuthContext';

type LocationState = {
  from?: string;
};

const LoginConsent = () => {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  const handleContinue = () => {
    login().catch(() => undefined);
  };

  return (
    <Layout>
      <section className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-card">
          <h1 className="text-2xl font-semibold">Перед входом</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ознакомьтесь с документами и подтвердите продолжение входа.
          </p>
          <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-4">
            <LegalConsentText className="text-sm" />
          </div>
          <GoogleSignInButton
            onClick={handleContinue}
            className="mt-6 w-full max-w-none"
            disabled={isLoading}
          >
            {isLoading ? 'Открываем вход...' : 'Войти через Google'}
          </GoogleSignInButton>
        </div>
      </section>
    </Layout>
  );
};

export default LoginConsent;
