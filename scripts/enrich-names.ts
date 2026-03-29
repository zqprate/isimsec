/**
 * İsimSeç — Name Data Enrichment Script
 *
 * Minimal isim verisini alır, otomatik hesaplanabilir alanları doldurur.
 * Çalıştırma: npx tsx scripts/enrich-names.ts [locale]
 *
 * Input format (minimal):
 * { "name": "Elif", "gender": "female", "origins": ["arabic"], "meaningCategories": ["graceful"], "meaning": "İnce, zarif" }
 *
 * Output: full NameEntry with computed fields (slug, syllableCount, etc.)
 */

import fs from "fs";
import path from "path";

const locale = process.argv[2] || "tr";

const VOWELS: Record<string, Set<string>> = {
  tr: new Set("aeıioöuüAEIİOÖUÜ"),
  en: new Set("aeiouyAEIOUY"),
  de: new Set("aeiouyäöüAEIOUYÄÖÜ"),
  ar: new Set("aiuAIU"), // Latin transliteration vowels
};

const META_TEMPLATES: Record<string, { title: (n: string) => string; desc: (n: string, m: string, g: string) => string }> = {
  tr: {
    title: (n) => `${n} İsminin Anlamı, Kökeni ve Özellikleri`,
    desc: (n, m, g) => `${n} ismi ne demek? ${m}. ${g === "male" ? "Erkek" : g === "female" ? "Kız" : "Unisex"} ismi. Popülerlik, köken ve detaylı bilgi.`,
  },
  en: {
    title: (n) => `${n}: Meaning, Origin & Popularity`,
    desc: (n, m, g) => `What does ${n} mean? ${m}. A ${g === "male" ? "boy" : g === "female" ? "girl" : "unisex"} name. Origin, popularity, and details.`,
  },
  de: {
    title: (n) => `${n}: Bedeutung, Herkunft und Beliebtheit`,
    desc: (n, m, g) => `Was bedeutet ${n}? ${m}. ${g === "male" ? "Jungen" : g === "female" ? "Mädchen" : "Unisex"}name. Herkunft und Details.`,
  },
  ar: {
    title: (n) => `معنى اسم ${n} وأصله وصفاته`,
    desc: (n, m, g) => `ما معنى اسم ${n}؟ ${m}. اسم ${g === "male" ? "ولد" : g === "female" ? "بنت" : "للجنسين"}.`,
  },
};

function slugify(name: string): string {
  const map: Record<string, string> = {
    ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o",
    ü: "u", Ü: "u", ş: "s", Ş: "s", ç: "c", Ç: "c",
    ä: "ae", Ä: "ae", ß: "ss",
  };
  return name
    .replace(/[ğĞıİöÖüÜşŞçÇäÄß]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-");
}

function countSyllables(name: string, loc: string): number {
  const vowelSet = VOWELS[loc] ?? VOWELS.en;
  return Math.max(1, [...name].filter((c) => vowelSet.has(c)).length);
}

interface MinimalName {
  name: string;
  gender: string;
  origins: string[];
  meaningCategories?: string[];
  meaning: string;
  description?: string;
  pronunciation?: string;
  famousPeople?: string[];
  culturalNotes?: string;
}

function enrich(entry: MinimalName, rank: number, loc: string) {
  const slug = slugify(entry.name);
  const tmpl = META_TEMPLATES[loc] ?? META_TEMPLATES.en;
  const metaDesc = tmpl.desc(entry.name, entry.meaning.slice(0, 80), entry.gender);

  return {
    slug,
    name: entry.name,
    gender: entry.gender,
    syllableCount: countSyllables(entry.name, loc),
    letterCount: entry.name.length,
    isPopular: rank <= 100,
    popularityRank: rank,
    origins: entry.origins,
    meaningCategories: entry.meaningCategories ?? [],
    translation: {
      meaning: entry.meaning,
      description: entry.description ?? null,
      pronunciation: entry.pronunciation ?? null,
      famousPeople: entry.famousPeople ?? [],
      culturalNotes: entry.culturalNotes ?? null,
      metaTitle: tmpl.title(entry.name).slice(0, 70),
      metaDescription: metaDesc.slice(0, 160),
    },
  };
}

// ── Main ───────────────────────────────────

const inputPath = path.join(__dirname, "..", "src", "data", "names", `${locale}-raw.json`);
const outputPath = path.join(__dirname, "..", "src", "data", "names", `${locale}.json`);

if (!fs.existsSync(inputPath)) {
  console.error(`No raw file found at ${inputPath}`);
  console.log("Create a file with minimal name entries and run again.");
  process.exit(1);
}

const raw: MinimalName[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const enriched = raw.map((entry, i) => enrich(entry, i + 1, locale));

// Merge with existing data (keep existing entries, append new ones)
let existing: { slug: string }[] = [];
if (fs.existsSync(outputPath)) {
  existing = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
}
const existingSlugs = new Set(existing.map((e) => e.slug));
const newEntries = enriched.filter((e) => !existingSlugs.has(e.slug));
const merged = [...existing, ...newEntries];

fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), "utf-8");
console.log(`✅ ${locale}: ${newEntries.length} new names added (total: ${merged.length})`);
