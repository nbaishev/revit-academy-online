import { LEGAL_DOCS } from '@/lib/legalDocs';

type LegalConsentTextProps = {
  className?: string;
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
        Договором оферты
      </a>
      ,{' '}
      <a
        className={linkClassName}
        href={LEGAL_DOCS.privacy}
        target="_blank"
        rel="noopener noreferrer"
      >
        Политикой конфиденциальности.
      </a>
    </p>
  );
}
