import { defineRouting } from "next-intl/routing";

export const locales = ["tr", "en", "de", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  ar: "العربية",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
  de: "ltr",
  ar: "rtl",
};

export const pathnames = {
  "/": "/",
  "/isimler": {
    tr: "/isimler",
    en: "/names",
    de: "/namen",
    ar: "/names",
  },
  "/isimler/[slug]": {
    tr: "/isimler/[slug]",
    en: "/names/[slug]",
    de: "/namen/[slug]",
    ar: "/names/[slug]",
  },
  "/erkek-isimleri": {
    tr: "/erkek-isimleri",
    en: "/boy-names",
    de: "/jungennamen",
    ar: "/boy-names",
  },
  "/kiz-isimleri": {
    tr: "/kiz-isimleri",
    en: "/girl-names",
    de: "/maedchennamen",
    ar: "/girl-names",
  },
  "/isim-secici": {
    tr: "/isim-secici",
    en: "/name-finder",
    de: "/namenfinder",
    ar: "/name-finder",
  },
  "/isim-karsilastir": {
    tr: "/isim-karsilastir",
    en: "/compare-names",
    de: "/namen-vergleichen",
    ar: "/compare-names",
  },
  "/soyad-uyumu": {
    tr: "/soyad-uyumu",
    en: "/surname-harmony",
    de: "/nachname-harmonie",
    ar: "/surname-harmony",
  },
  "/isim-kombinator": {
    tr: "/isim-kombinator",
    en: "/name-combinator",
    de: "/namen-kombinator",
    ar: "/name-combinator",
  },
  "/ebeveyn-uyumu": {
    tr: "/ebeveyn-uyumu",
    en: "/parent-match",
    de: "/eltern-match",
    ar: "/parent-match",
  },
  "/populer-isimler": {
    tr: "/populer-isimler",
    en: "/popular-names",
    de: "/beliebte-namen",
    ar: "/popular-names",
  },
  "/harf/[letter]": {
    tr: "/harf/[letter]",
    en: "/letter/[letter]",
    de: "/buchstabe/[letter]",
    ar: "/letter/[letter]",
  },
  "/koken/[origin]": {
    tr: "/koken/[origin]",
    en: "/origin/[origin]",
    de: "/herkunft/[origin]",
    ar: "/origin/[origin]",
  },
  "/anlam/[meaning]": {
    tr: "/anlam/[meaning]",
    en: "/meaning/[meaning]",
    de: "/bedeutung/[meaning]",
    ar: "/meaning/[meaning]",
  },
  "/blog": {
    tr: "/blog",
    en: "/blog",
    de: "/blog",
    ar: "/blog",
  },
  "/blog/[slug]": {
    tr: "/blog/[slug]",
    en: "/blog/[slug]",
    de: "/blog/[slug]",
    ar: "/blog/[slug]",
  },
  "/hakkimizda": {
    tr: "/hakkimizda",
    en: "/about",
    de: "/ueber-uns",
    ar: "/about",
  },
  "/iletisim": {
    tr: "/iletisim",
    en: "/contact",
    de: "/kontakt",
    ar: "/contact",
  },
  "/gizlilik": {
    tr: "/gizlilik",
    en: "/privacy",
    de: "/datenschutz",
    ar: "/privacy",
  },
  "/kullanim-sartlari": {
    tr: "/kullanim-sartlari",
    en: "/terms",
    de: "/nutzungsbedingungen",
    ar: "/terms",
  },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // TR = no prefix (isimsec.com/isimler), others = prefix (/en/names, /de/namen)
  pathnames,
});
