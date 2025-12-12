const TOKEN_KEY = 'revit-auth-tokens';

export interface StoredTokens {
  access: string;
  refresh: string;
}

export const loadTokens = (): StoredTokens | null => {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
};

export const saveTokens = (tokens: StoredTokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};
