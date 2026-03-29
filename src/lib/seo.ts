import type { Locale } from "@/i18n/routing";

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate JSON-LD BreadcrumbList structured data.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD for a name page (Thing + Article).
 */
export function namePageJsonLd({
  name,
  meaning,
  locale,
  url,
}: {
  name: string;
  meaning: string;
  locale: Locale;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name} — Anlam, Köken ve Popülerlik`,
    name,
    description: meaning,
    url,
    inLanguage: locale,
    datePublished: "2026-03-28",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "İsimSeç",
      url: "https://www.isimsec.com",
    },
    publisher: {
      "@type": "Organization",
      name: "İsimSeç",
      url: "https://www.isimsec.com",
    },
    mainEntity: {
      "@type": "Thing",
      name,
      description: meaning,
    },
  };
}

/**
 * Generate hreflang alternates for all supported locales.
 */
export function hreflangAlternates(
  path: string,
  locales: readonly string[]
): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[locale] = `https://www.isimsec.com/${locale}${path}`;
  }
  alternates["x-default"] = `https://www.isimsec.com/tr${path}`;
  return alternates;
}

/**
 * Generate FAQPage JSON-LD for AI citability.
 * Triple stacking: Article + BreadcrumbList + FAQPage = 1.8x more AI citations.
 */
export function faqPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate ItemList JSON-LD (for list/category pages).
 */
export function itemListJsonLd(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Generate Organization JSON-LD for the site.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "İsimSeç",
    url: "https://www.isimsec.com",
    description:
      "Çok dilli, interaktif bebek ismi keşif platformu. 13.000+ isim, 4 dilde anlamları ve kökenleri.",
  };
}
