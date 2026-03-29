/**
 * İsimSeç — Database Seed Script
 *
 * JSON veri dosyalarından veritabanını doldurur.
 * Çalıştırma: npx prisma db seed
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import originsData from "../src/data/origins.json";
import categoriesData from "../src/data/meaning-categories.json";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Types ──────────────────────────────────────────────

interface OriginEntry {
  slug: string;
  translations: Record<string, { name: string; description?: string }>;
}

interface CategoryEntry {
  slug: string;
  translations: Record<string, string>;
}

interface NameEntry {
  slug: string;
  name: string;
  gender: string;
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

// ── Seed functions ─────────────────────────────────────

async function seedOrigins() {
  console.log("  Seeding origins...");
  const origins = originsData as OriginEntry[];

  for (const origin of origins) {
    const created = await prisma.origin.upsert({
      where: { slug: origin.slug },
      update: {},
      create: { slug: origin.slug },
    });

    for (const [locale, trans] of Object.entries(origin.translations)) {
      await prisma.originTranslation.upsert({
        where: { originId_locale: { originId: created.id, locale } },
        update: { name: trans.name, description: trans.description ?? null },
        create: {
          originId: created.id,
          locale,
          name: trans.name,
          description: trans.description ?? null,
        },
      });
    }
  }
  console.log(`  ✓ ${origins.length} origins seeded`);
}

async function seedMeaningCategories() {
  console.log("  Seeding meaning categories...");
  const categories = categoriesData as CategoryEntry[];

  for (const cat of categories) {
    const created = await prisma.meaningCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { slug: cat.slug },
    });

    for (const [locale, name] of Object.entries(cat.translations)) {
      await prisma.meaningCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: created.id, locale } },
        update: { name },
        create: { categoryId: created.id, locale, name },
      });
    }
  }
  console.log(`  ✓ ${categories.length} meaning categories seeded`);
}

async function seedNamesForLocale(locale: string) {
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "names",
    `${locale}.json`
  );

  if (!fs.existsSync(filePath)) {
    console.log(`  ⊘ No data file for locale: ${locale}`);
    return 0;
  }

  const names: NameEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let count = 0;

  for (const entry of names) {
    // Upsert the name record
    const nameRecord = await prisma.name.upsert({
      where: { slug: entry.slug },
      update: {
        isPopular: entry.isPopular,
        popularityRank: entry.popularityRank,
      },
      create: {
        slug: entry.slug,
        name: entry.name,
        gender: entry.gender,
        syllableCount: entry.syllableCount,
        letterCount: entry.letterCount,
        startingLetter: entry.name[0].toLowerCase(),
        endingLetter: entry.name[entry.name.length - 1].toLowerCase(),
        isPopular: entry.isPopular,
        popularityRank: entry.popularityRank,
      },
    });

    // Upsert translation for this locale
    await prisma.nameTranslation.upsert({
      where: { nameId_locale: { nameId: nameRecord.id, locale } },
      update: {
        meaning: entry.translation.meaning,
        description: entry.translation.description ?? null,
        pronunciation: entry.translation.pronunciation ?? null,
        famousPeople: entry.translation.famousPeople ?? [],
        culturalNotes: entry.translation.culturalNotes ?? null,
        metaTitle: entry.translation.metaTitle ?? null,
        metaDescription: entry.translation.metaDescription ?? null,
      },
      create: {
        nameId: nameRecord.id,
        locale,
        meaning: entry.translation.meaning,
        description: entry.translation.description ?? null,
        pronunciation: entry.translation.pronunciation ?? null,
        famousPeople: entry.translation.famousPeople ?? [],
        culturalNotes: entry.translation.culturalNotes ?? null,
        metaTitle: entry.translation.metaTitle ?? null,
        metaDescription: entry.translation.metaDescription ?? null,
      },
    });

    // Link origins
    for (const originSlug of entry.origins) {
      const origin = await prisma.origin.findUnique({
        where: { slug: originSlug },
      });
      if (origin) {
        await prisma.nameOrigin.upsert({
          where: {
            nameId_originId: { nameId: nameRecord.id, originId: origin.id },
          },
          update: {},
          create: { nameId: nameRecord.id, originId: origin.id },
        });
      }
    }

    // Link meaning categories
    for (const catSlug of entry.meaningCategories) {
      const category = await prisma.meaningCategory.findUnique({
        where: { slug: catSlug },
      });
      if (category) {
        await prisma.nameMeaningCategory.upsert({
          where: {
            nameId_categoryId: {
              nameId: nameRecord.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: { nameId: nameRecord.id, categoryId: category.id },
        });
      }
    }

    count++;
  }

  return count;
}

// ── Main ───────────────────────────────────────────────

async function main() {
  console.log("🌱 İsimSeç — Seeding database...\n");

  await seedOrigins();
  await seedMeaningCategories();

  console.log("\n  Seeding names...");
  const locales = ["tr", "en", "de", "ar"];
  let totalNames = 0;

  for (const locale of locales) {
    const count = await seedNamesForLocale(locale);
    if (count > 0) {
      console.log(`  ✓ ${locale}: ${count} names seeded`);
    }
    totalNames += count;
  }

  console.log(`\n✅ Seeding complete! Total: ${totalNames} name entries.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
