import type { Locale } from "@/i18n/routing";

/**
 * Slugify a string for URL-safe paths.
 * Handles Turkish characters (ğ→g, ı→i, ö→o, ü→u, ş→s, ç→c).
 */
export function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ğ: "g",
    Ğ: "G",
    ı: "i",
    İ: "I",
    ö: "o",
    Ö: "O",
    ü: "u",
    Ü: "U",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
  };

  return text
    .replace(/[ğĞıİöÖüÜşŞçÇ]/g, (char) => turkishMap[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build the canonical URL for a given path and locale.
 */
export function canonicalUrl(path: string, locale: Locale): string {
  return `https://www.isimsec.com/${locale}${path}`;
}

/**
 * Format a number with locale-specific separators.
 */
export function formatNumber(num: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(num);
}
