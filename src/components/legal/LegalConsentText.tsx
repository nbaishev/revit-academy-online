type LegalConsentTextProps = {
  className?: string;
};

const LEGAL_DOCS = {
  agreement: '/docs/user-agreement.pdf',
  privacy: '/docs/privacy-policy.pdf',
  payments: '/docs/payments-refunds.pdf',
};

const linkClassName = 'underline underline-offset-2 transition-colors hover:text-primary';

export function LegalConsentText({ className }: LegalConsentTextProps) {
  return (
    <p className={`text-xs leading-snug text-muted-foreground ${className ?? ''}`}>
      Авторизуясь, вы соглашаетесь с{' '}
      <a
        className={linkClassName}
        href={LEGAL_DOCS.agreement}
        target="_blank"
        rel="noopener noreferrer"
      >
        Пользовательским соглашением
      </a>
      ,{' '}
      <a
        className={linkClassName}
        href={LEGAL_DOCS.privacy}
        target="_blank"
        rel="noopener noreferrer"
      >
        Политикой конфиденциальности
      </a>{' '}
      и{' '}
      <a
        className={linkClassName}
        href={LEGAL_DOCS.payments}
        target="_blank"
        rel="noopener noreferrer"
      >
        условиями оплаты и возврата
      </a>
      .
    </p>
  );
}
