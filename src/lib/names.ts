/**
 * İsimSeç — Name data utilities
 *
 * Mock data layer using seed JSON files.
 * Replace with Prisma queries when database is connected.
 */

import trNames from "@/data/names/tr.json";
import enNames from "@/data/names/en.json";
import deNames from "@/data/names/de.json";
import arNames from "@/data/names/ar.json";
import originsData from "@/data/origins.json";
import categoriesData from "@/data/meaning-categories.json";
import type { Locale } from "@/i18n/routing";

// ── Types ──────────────────────────────────

export interface NameEntry {
  slug: string;
  name: string;
  gender: "male" | "female" | "unisex";
  syllableCount: number;
  letterCount: number;
  isPopular: boolean;
  popularityRank: number;
  origins: string[];
  meaningCategories: string[];
  translation: {
    meaning: string;
    description?: string;
    pronunciation?: string;
    famousPeople?: string[];
    culturalNotes?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface OriginEntry {
  slug: string;
  translations: Record<string, { name: string; description?: string }>;
}

export interface CategoryEntry {
  slug: string;
  translations: Record<string, string>;
}

export interface NameFilters {
  gender?: "male" | "female" | "unisex" | null;
  startingLetter?: string | null;
  origins?: string[];
  meaningCategories?: string[];
  minSyllables?: number;
  maxSyllables?: number;
  onlyPopular?: boolean;
  query?: string;
  sort?: "az" | "za" | "popularity" | "letterCount";
}

// ── Data loading ───────────────────────────

const namesByLocale: Record<string, NameEntry[]> = {
  tr: trNames as NameEntry[],
  en: enNames as NameEntry[],
  de: deNames as NameEntry[],
  ar: arNames as NameEntry[],
};

export const origins = originsData as OriginEntry[];
export const meaningCategories = categoriesData as CategoryEntry[];

// ── Query functions ────────────────────────

export function getAllNames(locale: Locale): NameEntry[] {
  return namesByLocale[locale] ?? [];
}

export function getNameBySlug(
  slug: string,
  locale: Locale
): NameEntry | undefined {
  return getAllNames(locale).find((n) => n.slug === slug);
}

export function searchNames(
  locale: Locale,
  filters: NameFilters = {}
): NameEntry[] {
  let results = getAllNames(locale);

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.translation.meaning.toLowerCase().includes(q)
    );
  }

  if (filters.gender) {
    results = results.filter((n) => n.gender === filters.gender);
  }

  if (filters.startingLetter) {
    const letter = filters.startingLetter.toLowerCase();
    results = results.filter(
      (n) => n.name[0].toLowerCase() === letter
    );
  }

  if (filters.origins && filters.origins.length > 0) {
    results = results.filter((n) =>
      n.origins.some((o) => filters.origins!.includes(o))
    );
  }

  if (filters.meaningCategories && filters.meaningCategories.length > 0) {
    results = results.filter((n) =>
      n.meaningCategories.some((c) => filters.meaningCategories!.includes(c))
    );
  }

  if (filters.minSyllables) {
    results = results.filter((n) => n.syllableCount >= filters.minSyllables!);
  }

  if (filters.maxSyllables) {
    results = results.filter((n) => n.syllableCount <= filters.maxSyllables!);
  }

  if (filters.onlyPopular) {
    results = results.filter((n) => n.isPopular);
  }

  // Sort
  switch (filters.sort) {
    case "az":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "za":
      results.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "popularity":
      results.sort((a, b) => a.popularityRank - b.popularityRank);
      break;
    case "letterCount":
      results.sort((a, b) => a.letterCount - b.letterCount);
      break;
    default:
      results.sort((a, b) => a.popularityRank - b.popularityRank);
  }

  return results;
}

export function getSimilarNames(
  name: NameEntry,
  locale: Locale,
  limit = 6
): NameEntry[] {
  const all = getAllNames(locale).filter((n) => n.slug !== name.slug);

  // Score by similarity: same origin, same category, same starting letter
  const scored = all.map((n) => {
    let score = 0;
    if (n.origins.some((o) => name.origins.includes(o))) score += 3;
    if (n.meaningCategories.some((c) => name.meaningCategories.includes(c)))
      score += 2;
    if (n.name[0].toLowerCase() === name.name[0].toLowerCase()) score += 1;
    if (n.gender === name.gender) score += 1;
    return { name: n, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.name);
}

export function getOriginName(slug: string, locale: Locale): string {
  const origin = origins.find((o) => o.slug === slug);
  return origin?.translations[locale]?.name ?? slug;
}

export function getCategoryName(slug: string, locale: Locale): string {
  const cat = meaningCategories.find((c) => c.slug === slug);
  return cat?.translations[locale] ?? slug;
}

export function getNamesByLetter(
  letter: string,
  locale: Locale
): NameEntry[] {
  return getAllNames(locale).filter(
    (n) => n.name[0].toLowerCase() === letter.toLowerCase()
  );
}

export function getNamesByGender(
  gender: "male" | "female",
  locale: Locale
): NameEntry[] {
  return getAllNames(locale).filter(
    (n) => n.gender === gender || n.gender === "unisex"
  );
}
