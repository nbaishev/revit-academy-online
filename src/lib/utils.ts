import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralizeRu(count: number, forms: [string, string, string]) {
  const value = Math.abs(count);
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 14) {
    return forms[2];
  }
  const mod10 = value % 10;
  if (mod10 === 1) {
    return forms[0];
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return forms[1];
  }
  return forms[2];
}

export function formatUsd(amount: number) {
  return `$${amount.toLocaleString('ru-RU')}`;
}
