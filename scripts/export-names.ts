/**
 * İsimSeç — Export names from database to JSON
 *
 * Çalıştırma: npx tsx scripts/export-names.ts [locale]
 * Örnek:      npx tsx scripts/export-names.ts tr
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const locale = process.argv[2] || "tr";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Exporting names for locale: ${locale}...`);

  const names = await prisma.name.findMany({
    include: {
      translations: { where: { locale } },
      nameOrigins: { include: { origin: true } },
      nameMeanings: { include: { category: true } },
    },
    orderBy: { popularityRank: "asc" },
  });

  const exported = names
    .filter((n) => n.translations.length > 0)
    .map((n) => {
      const t = n.translations[0];
      return {
        slug: n.slug,
        name: n.name,
        gender: n.gender,
        syllableCount: n.syllableCount,
        letterCount: n.letterCount,
        isPopular: n.isPopular,
        popularityRank: n.popularityRank,
        origins: n.nameOrigins.map((no) => no.origin.slug),
        meaningCategories: n.nameMeanings.map((nm) => nm.category.slug),
        translation: {
          meaning: t.meaning,
          description: t.description,
          pronunciation: t.pronunciation,
          famousPeople: t.famousPeople,
          culturalNotes: t.culturalNotes,
          metaTitle: t.metaTitle,
          metaDescription: t.metaDescription,
        },
      };
    });

  const outPath = path.join(__dirname, "..", "src", "data", "names", `${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(exported, null, 2), "utf-8");
  console.log(`✅ Exported ${exported.length} names to ${outPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
