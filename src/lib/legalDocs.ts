const DOCS_BASE_URL = (() => {
  const explicit = import.meta.env.VITE_DOCS_BASE_URL;
  if (explicit) {
    return explicit.replace(/\/+$/, '');
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const withoutApi = apiBase.replace(/\/api\/?$/, '');
  return `${withoutApi}/static`.replace(/\/+$/, '');
})();

export const LEGAL_DOCS = {
  agreement: `${DOCS_BASE_URL}/user_agreement.pdf`,
  privacy: `${DOCS_BASE_URL}/privacy_policy.pdf`,
} as const;
