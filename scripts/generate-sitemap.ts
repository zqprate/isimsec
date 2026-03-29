/**
 * İsimSeç — Generate sitemap XML files
 *
 * DB'deki isimlerden sitemap dosyaları oluşturur.
 * Çalıştırma: npx tsx scripts/generate-sitemap.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "https://www.isimsec.com";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const localePathMap: Record<string, string> = {
  tr: "isimler",
  en: "names",
  de: "namen",
  ar: "names",
};

function sitemapXml(urls: { loc: string; lastmod: string; priority: string }[]) {
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

async function main() {
  console.log("Generating sitemaps...");
  const today = new Date().toISOString().split("T")[0];

  for (const [locale, pathSegment] of Object.entries(localePathMap)) {
    const names = await prisma.name.findMany({
      where: { translations: { some: { locale } } },
      select: { slug: true, updatedAt: true },
      orderBy: { popularityRank: "asc" },
    });

    const urls = names.map((n) => ({
      loc: `${BASE_URL}/${locale}/${pathSegment}/${n.slug}`,
      lastmod: n.updatedAt.toISOString().split("T")[0],
      priority: "0.8",
    }));

    const filePath = path.join(PUBLIC_DIR, `sitemap-${locale}-names.xml`);
    fs.writeFileSync(filePath, sitemapXml(urls), "utf-8");
    console.log(`  ✓ ${locale}: ${urls.length} URLs → ${filePath}`);
  }

  // Sitemap index
  const locales = Object.keys(localePathMap);
  const indexEntries = locales
    .map(
      (l) => `  <sitemap>
    <loc>${BASE_URL}/sitemap-${l}-names.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("\n");

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntries}
</sitemapindex>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-index.xml"), sitemapIndex, "utf-8");
  console.log(`\n✅ Sitemap index generated with ${locales.length} locale sitemaps.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
