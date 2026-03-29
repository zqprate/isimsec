"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Sparkles, Wand2, Copy, Check } from "lucide-react";
import { getAllNames, type NameEntry } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ═══════════════════════════════════════════
   COMBINATION ENGINE — 4 methods, pure client-side
   ═══════════════════════════════════════════ */

interface CombinedName {
  name: string;
  method: string;
  exists: boolean;
}

function syllabify(name: string): string[] {
  const vowels = "aeıioöuü";
  const syllables: string[] = [];
  let current = "";
  for (const char of name.toLowerCase()) {
    current += char;
    if (vowels.includes(char) && current.length > 0) {
      syllables.push(current);
      current = "";
    }
  }
  if (current) {
    if (syllables.length > 0) syllables[syllables.length - 1] += current;
    else syllables.push(current);
  }
  return syllables;
}

function combineNames(name1: string, name2: string, allNames: NameEntry[]): CombinedName[] {
  const syl1 = syllabify(name1);
  const syl2 = syllabify(name2);
  const results: CombinedName[] = [];
  const allSlugs = new Set(allNames.map((n) => n.slug));

  // Method 1: First syllable of name1 + last syllable of name2
  if (syl1.length > 0 && syl2.length > 0) {
    const combined = syl1[0] + syl2[syl2.length - 1];
    const capitalized =
      combined.charAt(0).toUpperCase() + combined.slice(1);
    results.push({
      name: capitalized,
      method: `${name1}'in ilk hecesi + ${name2}'nin son hecesi`,
      exists: allSlugs.has(combined),
    });
  }

  // Method 2: Last syllable of name1 + first syllable of name2
  if (syl1.length > 0 && syl2.length > 0) {
    const combined = syl1[syl1.length - 1] + syl2[0];
    const capitalized =
      combined.charAt(0).toUpperCase() + combined.slice(1);
    results.push({
      name: capitalized,
      method: `${name1}'in son hecesi + ${name2}'nin ilk hecesi`,
      exists: allSlugs.has(combined),
    });
  }

  // Method 3: First half of name1 + second half of name2
  const half1 = name1.slice(0, Math.ceil(name1.length / 2));
  const half2 = name2.slice(Math.floor(name2.length / 2));
  const combined3 =
    (half1 + half2).charAt(0).toUpperCase() +
    (half1 + half2).slice(1).toLowerCase();
  results.push({
    name: combined3,
    method: `${name1}'in ilk yarisi + ${name2}'nin son yarisi`,
    exists: allSlugs.has(combined3.toLowerCase()),
  });

  // Method 4: Interleaved letters
  let interleaved = "";
  const maxLen = Math.max(name1.length, name2.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < name1.length && interleaved.length < 8)
      interleaved += name1[i];
    if (i < name2.length && interleaved.length < 8)
      interleaved += name2[i];
  }
  interleaved = interleaved.slice(0, 6);
  const cap4 =
    interleaved.charAt(0).toUpperCase() +
    interleaved.slice(1).toLowerCase();
  results.push({
    name: cap4,
    method: "Harfleri serpistrilmis",
    exists: allSlugs.has(cap4.toLowerCase()),
  });

  // Remove duplicates
  const unique = results.filter(
    (r, i, arr) => arr.findIndex((x) => x.name === r.name) === i
  );
  return unique;
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function NameCombinatorPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const allNames = getAllNames(locale as Locale);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [results, setResults] = useState<CombinedName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCombine() {
    if (!name1.trim() || !name2.trim()) return;
    setResults(combineNames(name1.trim(), name2.trim(), allNames));
  }

  function handleCopy(name: string, index: number) {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal blur>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-gold-50 text-gold-500 text-sm font-medium mb-4 border border-gold-200">
              <Wand2 className="h-4 w-4" />
              Yaratici isim araci
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">
              Isim Kombinator
            </h1>
            <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
              Iki ismi birlestirip yeni isim uretin
            </p>
          </div>
        </ScrollReveal>

        {/* Input Section */}
        <ScrollReveal>
          <div className="glass-strong rounded-hero p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Birinci Isim
                </label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => {
                    setName1(e.target.value);
                    setResults([]);
                  }}
                  placeholder="orn: Elif"
                  className="input-glass w-full h-14 px-5 text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Ikinci Isim
                </label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    setResults([]);
                  }}
                  placeholder="orn: Deniz"
                  className="input-glass w-full h-14 px-5 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleCombine()}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCombine}
                disabled={!name1.trim() || !name2.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Shuffle className="h-4.5 w-4.5" />
                Birlestir
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="mt-10 space-y-4"
            >
              <p className="text-center text-slate-500 text-sm mb-6">
                <span className="font-display font-semibold text-ocean-800">
                  {name1.trim()}
                </span>{" "}
                +{" "}
                <span className="font-display font-semibold text-ocean-800">
                  {name2.trim()}
                </span>{" "}
                kombinasyonlari
              </p>

              {results.map((result, i) => (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.1,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="glass rounded-card p-6 flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-ocean-50 text-ocean-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl font-display font-bold text-ocean-800">
                        {result.name}
                      </span>
                      {result.exists && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">
                          <Check className="h-3 w-3" />
                          Bu isim veritabaninda mevcut!
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {result.method}
                    </p>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(result.name, i)}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 hover:bg-ocean-100 text-ocean-500 flex items-center justify-center transition-colors"
                    title="Panoya kopyala"
                  >
                    {copiedIndex === i ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
