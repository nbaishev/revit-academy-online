export type LessonMaterialItem = {
  description: string;
  href: string;
};

const MATERIAL_URL_REGEX = /((?:https?:\/\/|www\.|t\.me\/)[^\s]+)/i;

const normalizeExternalUrl = (value: string) => {
  const raw = value.trim();
  if (!raw) return '';
  if (raw.startsWith('//')) return `https:${raw}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.includes('.')) return `https://${raw}`;
  return raw;
};

const shortenText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const headLength = Math.max(12, Math.ceil((maxLength - 3) * 0.65));
  const tailLength = Math.max(8, maxLength - headLength - 3);
  return `${value.slice(0, headLength)}...${value.slice(-tailLength)}`;
};

export const parseLessonMaterials = (value?: string | null): LessonMaterialItem[] => {
  const raw = (value ?? '').trim();
  if (!raw) return [];

  return raw
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(MATERIAL_URL_REGEX);
      if (!match) {
        return { description: line, href: '' };
      }

      const rawUrl = match[1].replace(/[),.;]+$/, '');
      const description = line
        .replace(match[1], '')
        .replace(/^[\s|,:;-]+|[\s|,:;-]+$/g, '');

      return {
        description,
        href: normalizeExternalUrl(rawUrl),
      };
    })
    .filter((item) => item.description || item.href);
};

export const serializeLessonMaterials = (materials: LessonMaterialItem[]): string | null => {
  const lines = materials
    .map((material) => ({
      description: material.description.trim(),
      href: normalizeExternalUrl(material.href),
    }))
    .filter((material) => material.description || material.href)
    .map((material) => {
      if (material.description && material.href) {
        return `${material.description} | ${material.href}`;
      }
      return material.href || material.description;
    });

  return lines.length ? lines.join('\n') : null;
};

export const formatLessonMaterialLink = (value: string, maxLength = 56) => {
  const normalized = value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');

  if (normalized.length <= maxLength) return normalized;

  try {
    const url = new URL(normalizeExternalUrl(value));
    const host = url.host.replace(/^www\./i, '');
    const suffix = `${url.pathname}${url.search}${url.hash}` || '/';
    const remaining = Math.max(10, maxLength - host.length - 1);
    return `${host}${shortenText(suffix, remaining)}`;
  } catch {
    return shortenText(normalized, maxLength);
  }
};
