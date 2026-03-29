/**
 * İsimSeç — Language-Based Sitemap Generator
 *
 * Google SEO best practice: dil bazlı ayrı sitemap dosyaları + sitemap index.
 * Her dil kendi sitemap'inde, hreflang alternates ile cross-referans.
 *
 * Çalıştırma: npx tsx scripts/build-sitemaps.ts
 * Build sonrası otomatik: package.json postbuild script'inde.
 */

import fs from "fs";
import path from "path";

const BASE = "https://www.isimsec.com";
const OUT = path.join(__dirname, "..", "public");
const NOW = new Date().toISOString().split("T")[0];

const LOCALES = ["tr", "en", "de", "ar"] as const;
type Locale = (typeof LOCALES)[number];

const NAME_SEGMENTS: Record<Locale, string> = { tr: "isimler", en: "names", de: "namen", ar: "names" };
const LETTER_SEGMENTS: Record<Locale, string> = { tr: "harf", en: "letter", de: "buchstabe", ar: "letter" };
const ORIGIN_SEGMENTS: Record<Locale, string> = { tr: "koken", en: "origin", de: "herkunft", ar: "origin" };
const MEANING_SEGMENTS: Record<Locale, string> = { tr: "anlam", en: "meaning", de: "bedeutung", ar: "meaning" };

// Static pages with localized slugs
const STATIC_PAGES: Record<Locale, { path: string; priority: string; freq: string }[]> = {
  tr: [
    { path: "", priority: "1.0", freq: "daily" },
    { path: "/isimler", priority: "0.9", freq: "daily" },
    { path: "/erkek-isimleri", priority: "0.8", freq: "weekly" },
    { path: "/kiz-isimleri", priority: "0.8", freq: "weekly" },
    { path: "/populer-isimler", priority: "0.8", freq: "weekly" },
    { path: "/isim-secici", priority: "0.8", freq: "monthly" },
    { path: "/soyad-uyumu", priority: "0.8", freq: "monthly" },
    { path: "/isim-karsilastir", priority: "0.7", freq: "monthly" },
    { path: "/isim-kombinator", priority: "0.7", freq: "monthly" },
    { path: "/ebeveyn-uyumu", priority: "0.7", freq: "monthly" },
    { path: "/blog", priority: "0.6", freq: "weekly" },
    { path: "/hakkimizda", priority: "0.5", freq: "monthly" },
    { path: "/iletisim", priority: "0.4", freq: "monthly" },
    { path: "/gizlilik", priority: "0.3", freq: "yearly" },
    { path: "/kullanim-sartlari", priority: "0.3", freq: "yearly" },
  ],
  en: [
    { path: "", priority: "1.0", freq: "daily" },
    { path: "/names", priority: "0.9", freq: "daily" },
    { path: "/boy-names", priority: "0.8", freq: "weekly" },
    { path: "/girl-names", priority: "0.8", freq: "weekly" },
    { path: "/popular-names", priority: "0.8", freq: "weekly" },
    { path: "/name-finder", priority: "0.8", freq: "monthly" },
    { path: "/surname-harmony", priority: "0.8", freq: "monthly" },
    { path: "/compare-names", priority: "0.7", freq: "monthly" },
    { path: "/name-combinator", priority: "0.7", freq: "monthly" },
    { path: "/parent-match", priority: "0.7", freq: "monthly" },
    { path: "/blog", priority: "0.6", freq: "weekly" },
    { path: "/about", priority: "0.5", freq: "monthly" },
    { path: "/contact", priority: "0.4", freq: "monthly" },
    { path: "/privacy", priority: "0.3", freq: "yearly" },
    { path: "/terms", priority: "0.3", freq: "yearly" },
  ],
  de: [
    { path: "", priority: "1.0", freq: "daily" },
    { path: "/namen", priority: "0.9", freq: "daily" },
    { path: "/jungennamen", priority: "0.8", freq: "weekly" },
    { path: "/maedchennamen", priority: "0.8", freq: "weekly" },
    { path: "/beliebte-namen", priority: "0.8", freq: "weekly" },
    { path: "/namenfinder", priority: "0.8", freq: "monthly" },
    { path: "/nachname-harmonie", priority: "0.8", freq: "monthly" },
    { path: "/namen-vergleichen", priority: "0.7", freq: "monthly" },
    { path: "/namen-kombinator", priority: "0.7", freq: "monthly" },
    { path: "/eltern-match", priority: "0.7", freq: "monthly" },
    { path: "/blog", priority: "0.6", freq: "weekly" },
    { path: "/ueber-uns", priority: "0.5", freq: "monthly" },
    { path: "/kontakt", priority: "0.4", freq: "monthly" },
    { path: "/datenschutz", priority: "0.3", freq: "yearly" },
    { path: "/nutzungsbedingungen", priority: "0.3", freq: "yearly" },
  ],
  ar: [
    { path: "", priority: "1.0", freq: "daily" },
    { path: "/names", priority: "0.9", freq: "daily" },
    { path: "/boy-names", priority: "0.8", freq: "weekly" },
    { path: "/girl-names", priority: "0.8", freq: "weekly" },
    { path: "/popular-names", priority: "0.8", freq: "weekly" },
    { path: "/name-finder", priority: "0.8", freq: "monthly" },
    { path: "/surname-harmony", priority: "0.8", freq: "monthly" },
    { path: "/compare-names", priority: "0.7", freq: "monthly" },
    { path: "/name-combinator", priority: "0.7", freq: "monthly" },
    { path: "/parent-match", priority: "0.7", freq: "monthly" },
    { path: "/blog", priority: "0.6", freq: "weekly" },
    { path: "/about", priority: "0.5", freq: "monthly" },
    { path: "/contact", priority: "0.4", freq: "monthly" },
    { path: "/privacy", priority: "0.3", freq: "yearly" },
    { path: "/terms", priority: "0.3", freq: "yearly" },
  ],
};

// ── Helpers ────────────────────────────────

function hreflangBlock(loc: Locale, pagePath: string, allLocalePaths: Record<Locale, string>): string {
  const links = LOCALES.map(
    (l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}/${l}${allLocalePaths[l]}" />`
  ).join("\n");
  const xdefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/tr${allLocalePaths.tr}" />`;
  return `${links}\n${xdefault}`;
}

function urlEntry(loc: string, priority: string, freq: string, hreflang?: string): string {
  return `  <url>
    <loc>${BASE}/${loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
${hreflang || ""}
  </url>`;
}

function wrapSitemap(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`;
}

// ── Build per-locale sitemaps ──────────────

function buildLocaleSitemap(locale: Locale): string {
  const entries: string[] = [];

  // Static pages
  for (const page of STATIC_PAGES[locale]) {
    entries.push(urlEntry(`${locale}${page.path}`, page.priority, page.freq));
  }

  // Name pages
  try {
    const names = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "src", "data", "names", `${locale}.json`), "utf-8")
    );
    const seg = NAME_SEGMENTS[locale];
    for (const name of names) {
      entries.push(urlEntry(`${locale}/${seg}/${name.slug}`, "0.8", "monthly"));
    }
  } catch {
    // No name data for this locale
  }

  // Letter pages
  const letters = locale === "tr"
    ? "abcçdefgğhıijklmnoöprsştuüvyz".split("")
    : "abcdefghijklmnopqrstuvwxyz".split("");
  const lSeg = LETTER_SEGMENTS[locale];
  for (const letter of letters) {
    entries.push(urlEntry(`${locale}/${lSeg}/${letter}`, "0.6", "weekly"));
  }

  // Origin pages
  const origins = ["arabic", "turkish", "persian", "hebrew", "latin", "greek", "germanic", "english", "celtic", "french", "italian", "slavic", "scandinavian"];
  const oSeg = ORIGIN_SEGMENTS[locale];
  for (const origin of origins) {
    entries.push(urlEntry(`${locale}/${oSeg}/${origin}`, "0.6", "weekly"));
  }

  // Meaning pages
  const meanings = ["strong", "beautiful", "light", "love", "nature", "brave", "wise", "noble", "peaceful", "pure", "joyful", "graceful", "divine"];
  const mSeg = MEANING_SEGMENTS[locale];
  for (const meaning of meanings) {
    entries.push(urlEntry(`${locale}/${mSeg}/${meaning}`, "0.6", "weekly"));
  }

  return wrapSitemap(entries);
}

// ── Static pages sitemap (cross-locale) ────

function buildPagesSitemap(): string {
  const entries: string[] = [];

  for (let i = 0; i < STATIC_PAGES.tr.length; i++) {
    for (const locale of LOCALES) {
      const page = STATIC_PAGES[locale][i];
      if (page) {
        entries.push(urlEntry(`${locale}${page.path}`, page.priority, page.freq));
      }
    }
  }

  return wrapSitemap(entries);
}

// ── Sitemap Index ──────────────────────────

function buildSitemapIndex(): string {
  const sitemaps = [
    ...LOCALES.map((l) => `  <sitemap>
    <loc>${BASE}/sitemap-${l}.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>`),
    `  <sitemap>
    <loc>${BASE}/sitemap-pages.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>`,
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join("\n")}
</sitemapindex>`;
}

// ── Main ───────────────────────────────────

console.log("🗺️  İsimSeç — Building language-based sitemaps...\n");

for (const locale of LOCALES) {
  const xml = buildLocaleSitemap(locale);
  const filePath = path.join(OUT, `sitemap-${locale}.xml`);
  fs.writeFileSync(filePath, xml, "utf-8");
  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`  ✓ sitemap-${locale}.xml — ${urlCount} URLs`);
}

const pagesXml = buildPagesSitemap();
fs.writeFileSync(path.join(OUT, "sitemap-pages.xml"), pagesXml, "utf-8");
const pagesCount = (pagesXml.match(/<url>/g) || []).length;
console.log(`  ✓ sitemap-pages.xml — ${pagesCount} URLs`);

const indexXml = buildSitemapIndex();
fs.writeFileSync(path.join(OUT, "sitemap.xml"), indexXml, "utf-8");
console.log(`  ✓ sitemap.xml — index (${LOCALES.length + 1} sitemaps)\n`);

const totalUrls = LOCALES.reduce((sum, l) => {
  const xml = fs.readFileSync(path.join(OUT, `sitemap-${l}.xml`), "utf-8");
  return sum + (xml.match(/<url>/g) || []).length;
}, 0) + pagesCount;

console.log(`✅ Toplam: ${totalUrls} URL, ${LOCALES.length + 1} sitemap dosyası\n`);
