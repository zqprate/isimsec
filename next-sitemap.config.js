/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.isimsec.com",
  generateRobotsTxt: false,
  sitemapSize: 5000,
  outDir: "public",
  exclude: ["/api/*", "/_not-found"],

  // Hreflang alternates for every URL
  alternateRefs: [
    { href: "https://www.isimsec.com/tr", hreflang: "tr" },
    { href: "https://www.isimsec.com/en", hreflang: "en" },
    { href: "https://www.isimsec.com/de", hreflang: "de" },
    { href: "https://www.isimsec.com/ar", hreflang: "ar" },
  ],

  // Custom sitemap generation: language-based split
  additionalPaths: async (config) => {
    const paths = [];

    // ── Static pages (tools, hub, legal) ────────
    const staticPages = [
      { path: "", priority: 1.0, changefreq: "daily" },
      { path: "/isimler", priority: 0.9, changefreq: "daily" },
      { path: "/erkek-isimleri", priority: 0.8, changefreq: "weekly" },
      { path: "/kiz-isimleri", priority: 0.8, changefreq: "weekly" },
      { path: "/populer-isimler", priority: 0.8, changefreq: "weekly" },
      { path: "/isim-secici", priority: 0.8, changefreq: "monthly" },
      { path: "/isim-karsilastir", priority: 0.7, changefreq: "monthly" },
      { path: "/soyad-uyumu", priority: 0.8, changefreq: "monthly" },
      { path: "/isim-kombinator", priority: 0.7, changefreq: "monthly" },
      { path: "/ebeveyn-uyumu", priority: 0.7, changefreq: "monthly" },
      { path: "/blog", priority: 0.6, changefreq: "weekly" },
      { path: "/hakkimizda", priority: 0.5, changefreq: "monthly" },
      { path: "/iletisim", priority: 0.4, changefreq: "monthly" },
      { path: "/gizlilik", priority: 0.3, changefreq: "yearly" },
      { path: "/kullanim-sartlari", priority: 0.3, changefreq: "yearly" },
    ];

    const locales = ["tr", "en", "de", "ar"];
    const now = new Date().toISOString();

    for (const locale of locales) {
      for (const page of staticPages) {
        paths.push({
          loc: `/${locale}${page.path}`,
          lastmod: now,
          changefreq: page.changefreq,
          priority: page.priority,
        });
      }
    }

    // ── Name pages per locale ────────
    const nameSegments = { tr: "isimler", en: "names", de: "namen", ar: "names" };

    for (const locale of locales) {
      try {
        const names = require(`./src/data/names/${locale}.json`);
        const segment = nameSegments[locale];
        for (const name of names) {
          paths.push({
            loc: `/${locale}/${segment}/${name.slug}`,
            lastmod: now,
            changefreq: "monthly",
            priority: 0.8,
          });
        }
      } catch {
        // Locale data file not found — skip
      }
    }

    // ── Letter pages ────────
    const letters = "abcdefghijklmnoprstuvyz".split("");
    const letterSegments = { tr: "harf", en: "letter", de: "buchstabe", ar: "letter" };

    for (const locale of locales) {
      for (const letter of letters) {
        paths.push({
          loc: `/${locale}/${letterSegments[locale]}/${letter}`,
          lastmod: now,
          changefreq: "weekly",
          priority: 0.6,
        });
      }
    }

    // ── Origin pages ────────
    const originSlugs = [
      "arabic", "turkish", "persian", "hebrew", "latin", "greek",
      "germanic", "english", "celtic", "french", "italian", "slavic", "scandinavian",
    ];
    const originSegments = { tr: "koken", en: "origin", de: "herkunft", ar: "origin" };

    for (const locale of locales) {
      for (const origin of originSlugs) {
        paths.push({
          loc: `/${locale}/${originSegments[locale]}/${origin}`,
          lastmod: now,
          changefreq: "weekly",
          priority: 0.6,
        });
      }
    }

    // ── Meaning pages ────────
    const meaningSlugs = [
      "strong", "beautiful", "light", "love", "nature", "brave",
      "wise", "noble", "peaceful", "pure", "joyful", "graceful", "divine",
    ];
    const meaningSegments = { tr: "anlam", en: "meaning", de: "bedeutung", ar: "meaning" };

    for (const locale of locales) {
      for (const meaning of meaningSlugs) {
        paths.push({
          loc: `/${locale}/${meaningSegments[locale]}/${meaning}`,
          lastmod: now,
          changefreq: "weekly",
          priority: 0.6,
        });
      }
    }

    return paths;
  },

  // Disable default discovery — we handle everything in additionalPaths
  transform: async (config, path) => {
    return null; // Skip auto-discovered paths, we generate all manually
  },

  // Generate per-locale sitemaps
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.isimsec.com/sitemap-tr.xml",
      "https://www.isimsec.com/sitemap-en.xml",
      "https://www.isimsec.com/sitemap-de.xml",
      "https://www.isimsec.com/sitemap-ar.xml",
      "https://www.isimsec.com/sitemap-pages.xml",
    ],
  },
};
