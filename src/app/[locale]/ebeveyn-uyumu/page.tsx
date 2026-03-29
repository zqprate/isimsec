"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Baby, User, Sparkles } from "lucide-react";
import { getAllNames, type NameEntry } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ── Types ──────────────────────────────────── */

interface ScoredName extends NameEntry {
  matchScore: number;
  matchReasons: string[];
}

/* ── Matching Algorithm ─────────────────────── */

function countSyllables(word: string): number {
  const vowels = "aeıioöuü";
  return [...word].filter((c) => vowels.includes(c)).length || 1;
}

function findMatchingNames(
  motherName: string,
  fatherName: string,
  gender: "male" | "female" | null,
  allNames: NameEntry[],
): ScoredName[] {
  const mn = motherName.toLowerCase();
  const fn = fatherName.toLowerCase();

  const candidates = gender
    ? allNames.filter((n) => n.gender === gender || n.gender === "unisex")
    : allNames;

  return candidates
    .map((name) => {
      let score = 0;
      const reasons: string[] = [];
      const nameLower = name.name.toLowerCase();

      // Starting letter matches parent
      if (nameLower[0] === mn[0]) {
        score += 20;
        reasons.push(
          `Anne ismiyle aynı harfle başlıyor (${mn[0].toUpperCase()})`,
        );
      }
      if (nameLower[0] === fn[0]) {
        score += 20;
        reasons.push(
          `Baba ismiyle aynı harfle başlıyor (${fn[0].toUpperCase()})`,
        );
      }

      // Shared letters
      const parentLetters = new Set([...mn, ...fn]);
      const shared = [...nameLower].filter((c) => parentLetters.has(c)).length;
      const sharedRatio = shared / nameLower.length;
      if (sharedRatio > 0.6) {
        score += 15;
        reasons.push("Ebeveyn isimleriyle ortak harfler yüksek");
      }

      // Syllable harmony
      const avgParentSyl = (countSyllables(mn) + countSyllables(fn)) / 2;
      if (Math.abs(name.syllableCount - avgParentSyl) <= 1) {
        score += 15;
        reasons.push("Aile hece ortalamasına uygun");
      }

      // Popular bonus
      if (name.isPopular) {
        score += 5;
        reasons.push("Popüler isim");
      }

      // Same ending sound
      if (
        nameLower.endsWith(mn.slice(-2)) ||
        nameLower.endsWith(fn.slice(-2))
      ) {
        score += 10;
        reasons.push("Benzer ses yapısı");
      }

      return {
        ...name,
        matchScore: Math.min(score, 100),
        matchReasons: reasons,
      };
    })
    .filter((n) => n.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 15);
}

/* ── Score badge color helper ───────────────── */

function getScoreColor(score: number): string {
  if (score >= 50) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 30) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-600 border-red-200";
}

function getScoreLabel(score: number): string {
  if (score >= 50) return "Yüksek Uyum";
  if (score >= 30) return "Orta Uyum";
  return "Düşük Uyum";
}

/* ── Gender toggle options ──────────────────── */

const GENDER_OPTIONS = [
  { value: "male" as const, label: "Erkek", icon: User },
  { value: "female" as const, label: "Kız", icon: Baby },
  { value: null, label: "Farketmez", icon: Users },
];

/* ── Page Component ─────────────────────────── */

export default function EbeveynUyumuPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const allNames = getAllNames(locale as Locale);

  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [results, setResults] = useState<ScoredName[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = motherName.trim().length >= 2 && fatherName.trim().length >= 2;

  function handleSearch() {
    if (!canSearch) return;
    const matched = findMatchingNames(motherName.trim(), fatherName.trim(), gender, allNames);
    setResults(matched);
    setHasSearched(true);
  }

  return (
    <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────── */}
      <ScrollReveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-coral-50 to-ocean-100/60 mb-5">
            <Heart className="h-8 w-8 text-coral-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ocean-900">
            Ebeveyn İsim Uyumu
          </h1>
          <p className="mt-3 text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
            Anne ve baba isimlerinin duygusal bağını bebeğinize taşıyın.
            Ebeveyn isimlerinizle uyumlu bebek isimleri keşfedin.
          </p>
        </div>
      </ScrollReveal>

      {/* ── Input Section ───────────────────── */}
      <ScrollReveal delay={0.1}>
        <div className="glass-strong rounded-[var(--radius-hero)] p-8 mb-10">
          {/* Parent name inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Mother name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-ocean-800 mb-2">
                <User className="h-4 w-4 text-coral-400" />
                Anne İsmi
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="Anne ismini girin..."
                className="input-glass w-full px-4 py-3 text-ocean-900 placeholder:text-slate-400"
              />
            </div>

            {/* Father name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-ocean-800 mb-2">
                <User className="h-4 w-4 text-ocean-500" />
                Baba İsmi
              </label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Baba ismini girin..."
                className="input-glass w-full px-4 py-3 text-ocean-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Gender toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-ocean-800 mb-3">
              <Baby className="h-4 w-4 text-ocean-500" />
              Bebek Cinsiyeti
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = gender === option.value;

                return (
                  <button
                    key={option.label}
                    onClick={() => setGender(option.value)}
                    className={`chip ${isActive ? "chip-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search button */}
          <motion.button
            whileHover={{ scale: canSearch ? 1.02 : 1 }}
            whileTap={{ scale: canSearch ? 0.98 : 1 }}
            onClick={handleSearch}
            disabled={!canSearch}
            className={`btn-primary w-full gap-2 ${
              !canSearch ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Sparkles className="h-5 w-5" />
            Uyumlu İsimleri Bul
          </motion.button>
        </div>
      </ScrollReveal>

      {/* ── Results ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {hasSearched && results.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-ocean-800">
                  Uyumlu İsimler
                </h2>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: 0.2,
                  }}
                  className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-ocean-100 text-ocean-700"
                >
                  {results.length} isim
                </motion.span>
              </div>
              <p className="text-sm text-slate-500 hidden sm:block">
                {motherName} & {fatherName}
              </p>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((name, i) => (
                <motion.div
                  key={name.slug}
                  initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(i * 0.06, 0.8),
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="glass rounded-[var(--radius-card)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1"
                >
                  {/* Name + score */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-display font-bold text-ocean-900">
                      {name.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${getScoreColor(name.matchScore)}`}
                    >
                      <Heart className="h-3 w-3" />
                      {name.matchScore}
                    </span>
                  </div>

                  {/* Score label */}
                  <p className="text-xs font-medium text-slate-500 mb-3">
                    {getScoreLabel(name.matchScore)}
                  </p>

                  {/* Meaning (if available) */}
                  {name.translation.meaning && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {name.translation.meaning}
                    </p>
                  )}

                  {/* Match reasons */}
                  <div className="flex flex-wrap gap-1.5">
                    {name.matchReasons.map((reason, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-ocean-50 text-ocean-600 border border-ocean-100"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {hasSearched && results.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="glass-strong rounded-[var(--radius-hero)] p-12 sm:p-16 text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center mb-5">
              <Users className="h-7 w-7 text-ocean-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-ocean-800 mb-2">
              Uyumlu isim bulunamadı
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Girdiğiniz isimlerle uyumlu bir sonuç bulunamadı.
              Farklı isimler veya cinsiyet tercihi ile tekrar deneyin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
