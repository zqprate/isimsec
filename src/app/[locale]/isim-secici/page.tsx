"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Baby,
  Users,
  RotateCcw,
} from "lucide-react";
import {
  searchNames,
  origins,
  meaningCategories,
  type NameFilters,
} from "@/lib/names";
import { NameCard } from "@/components/name/NameCard";
import type { Locale } from "@/i18n/routing";

/* ── Constants ─────────────────────────────── */

const TURKISH_ALPHABET = "ABCCDEFGGHIiJKLMNOOPRSSTUUVYZ";

const SYLLABLE_OPTIONS = [
  { label: "1", min: 1, max: 1 },
  { label: "2", min: 2, max: 2 },
  { label: "3", min: 3, max: 3 },
  { label: "4", min: 4, max: 4 },
  { label: "5+", min: 5, max: 99 },
];

const GENDER_OPTIONS = [
  {
    value: "male" as const,
    label: "Erkek",
    icon: User,
    tint: "from-ocean-50 to-ocean-100/60",
    ring: "ring-ocean-400",
    iconColor: "text-ocean-500",
  },
  {
    value: "female" as const,
    label: "Kiz",
    icon: Baby,
    tint: "from-coral-50 to-coral-100/60",
    ring: "ring-coral-400",
    iconColor: "text-coral-400",
  },
  {
    value: null,
    label: "Fark Etmez",
    icon: Users,
    tint: "from-purple-50 to-purple-100/60",
    ring: "ring-purple-400",
    iconColor: "text-purple-500",
  },
];

/* ── Animation variants ────────────────────── */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

const staggerContainer = {
  center: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUpItem = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
};

/* ── Step labels for progress bar ──────────── */

const STEPS = [
  { num: 1, label: "Cinsiyet" },
  { num: 2, label: "Tercihler" },
  { num: 3, label: "Sonuclar" },
];

/* ── Progress Bar ──────────────────────────── */

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mt-8 mb-10">
      {STEPS.map((s, i) => {
        const isCompleted = currentStep > s.num;
        const isCurrent = currentStep === s.num;

        return (
          <div key={s.num} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "#3B93F5"
                    : isCurrent
                      ? "#2574EA"
                      : "rgba(255,255,255,0.7)",
                  borderColor: isCompleted || isCurrent
                    ? "#3B93F5"
                    : "rgba(203,213,225,0.6)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative"
                style={{
                  boxShadow: isCurrent
                    ? "0 0 0 4px rgba(59,147,245,0.15), 0 4px 12px rgba(59,147,245,0.2)"
                    : isCompleted
                      ? "0 2px 8px rgba(59,147,245,0.15)"
                      : "var(--shadow-soft)",
                }}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {s.num}
                  </span>
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isCurrent
                    ? "text-ocean-600"
                    : isCompleted
                      ? "text-ocean-500"
                      : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="w-16 sm:w-24 h-0.5 mx-2 mb-6 rounded-full overflow-hidden bg-slate-200/60">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full bg-ocean-400 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Page Component ────────────────────────── */

export default function IsimSeciciPage() {
  const t = useTranslations("common");
  const locale = useLocale();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [filters, setFilters] = useState<NameFilters>({});

  /* ── Navigation helpers ──────────────────── */

  function goToStep(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  function handleGenderSelect(gender: "male" | "female" | null) {
    setFilters((prev) => ({
      ...prev,
      gender: gender ?? undefined,
    }));
    // Auto-advance to step 2
    setDirection(1);
    setStep(2);
  }

  function handleReset() {
    setFilters({});
    setDirection(-1);
    setStep(1);
  }

  /* ── Results computation ─────────────────── */

  const results = useMemo(
    () => searchNames(locale as Locale, filters),
    [locale, filters],
  );

  /* ── Toggle helpers for multi-select ─────── */

  function toggleOrigin(slug: string) {
    setFilters((prev) => {
      const current = prev.origins ?? [];
      const next = current.includes(slug)
        ? current.filter((o) => o !== slug)
        : [...current, slug];
      return { ...prev, origins: next.length > 0 ? next : undefined };
    });
  }

  function toggleCategory(slug: string) {
    setFilters((prev) => {
      const current = prev.meaningCategories ?? [];
      const next = current.includes(slug)
        ? current.filter((c) => c !== slug)
        : [...current, slug];
      return {
        ...prev,
        meaningCategories: next.length > 0 ? next : undefined,
      };
    });
  }

  function toggleSyllable(min: number, max: number) {
    setFilters((prev) => {
      const isActive = prev.minSyllables === min && prev.maxSyllables === max;
      return {
        ...prev,
        minSyllables: isActive ? undefined : min,
        maxSyllables: isActive ? undefined : max,
      };
    });
  }

  function toggleLetter(letter: string) {
    setFilters((prev) => ({
      ...prev,
      startingLetter: prev.startingLetter === letter ? undefined : letter,
    }));
  }

  /* ── Render ──────────────────────────────── */

  return (
    <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ocean-900">
          Isim Secici
        </h1>
        <p className="mt-3 text-slate-500 text-base sm:text-lg">
          3 adimda bebeginize en uygun ismi bulun
        </p>
      </motion.div>

      {/* Progress bar */}
      <ProgressBar currentStep={step} />

      {/* Step content */}
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══════════════════════════════════
              STEP 1 — Gender Selection
              ═══════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <motion.div
                variants={staggerContainer}
                initial="enter"
                animate="center"
                className="text-center mb-8"
              >
                <motion.h2
                  variants={fadeUpItem}
                  transition={{ duration: 0.4 }}
                  className="text-xl sm:text-2xl font-display font-semibold text-ocean-800"
                >
                  Bebeginizin cinsiyetini secin
                </motion.h2>
                <motion.p
                  variants={fadeUpItem}
                  transition={{ duration: 0.4 }}
                  className="mt-2 text-slate-500 text-sm"
                >
                  Cinsiyet secimi sonuclari daraltmaniza yardimci olur
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {GENDER_OPTIONS.map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = filters.gender === option.value ||
                    (option.value === null && filters.gender === undefined);

                  return (
                    <motion.button
                      key={option.label}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleGenderSelect(option.value)}
                      className={`clay-interactive p-8 text-center cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `ring-2 ${option.ring} bg-ocean-50/30`
                          : ""
                      }`}
                    >
                      <div
                        className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${option.tint} flex items-center justify-center mb-4`}
                      >
                        <Icon className={`h-8 w-8 ${option.iconColor}`} />
                      </div>
                      <span className="text-lg font-display font-semibold text-ocean-800 block">
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STEP 2 — Preferences
              ═══════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="space-y-8"
            >
              {/* Starting letter */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <h3 className="text-base font-display font-semibold text-ocean-800 mb-3">
                  Bas Harf
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TURKISH_ALPHABET.split("").map((letter) => (
                    <button
                      key={letter}
                      onClick={() => toggleLetter(letter)}
                      className={`chip min-w-[38px] justify-center ${
                        filters.startingLetter === letter ? "chip-active" : ""
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Syllable count */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-base font-display font-semibold text-ocean-800 mb-3">
                  Hece Sayisi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SYLLABLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => toggleSyllable(opt.min, opt.max)}
                      className={`chip min-w-[48px] justify-center ${
                        filters.minSyllables === opt.min &&
                        filters.maxSyllables === opt.max
                          ? "chip-active"
                          : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Origin selection */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <h3 className="text-base font-display font-semibold text-ocean-800 mb-3">
                  Koken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {origins.map((o) => (
                    <button
                      key={o.slug}
                      onClick={() => toggleOrigin(o.slug)}
                      className={`chip ${
                        filters.origins?.includes(o.slug) ? "chip-active" : ""
                      }`}
                    >
                      {o.translations.tr?.name ?? o.slug}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Meaning category */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-base font-display font-semibold text-ocean-800 mb-3">
                  Anlam Kategorisi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meaningCategories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => toggleCategory(c.slug)}
                      className={`chip ${
                        filters.meaningCategories?.includes(c.slug)
                          ? "chip-active"
                          : ""
                      }`}
                    >
                      {c.translations.tr ?? c.slug}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Navigation buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex items-center justify-between pt-4"
              >
                <button
                  onClick={() => goToStep(1)}
                  className="btn-ghost gap-2 !px-6"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className="btn-primary gap-2 !px-8"
                >
                  Ileri
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STEP 3 — Results
              ═══════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {/* Header with count + back button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-ocean-800">
                    Sonuclar
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
                    {results.length} isim bulundu
                  </motion.span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToStep(2)}
                    className="btn-ghost gap-2 !px-5 !py-2.5 !min-h-0 text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Kriterleri Degistir
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-ghost gap-2 !px-5 !py-2.5 !min-h-0 text-sm"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Sifirla
                  </button>
                </div>
              </motion.div>

              {/* Results grid or empty state */}
              {results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {results.map((name, i) => (
                    <motion.div
                      key={name.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(i * 0.04, 0.8),
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <NameCard name={name} locale={locale} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="clay p-12 sm:p-16 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center mb-5">
                    <Users className="h-7 w-7 text-ocean-400" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-ocean-800 mb-2">
                    Sonuc bulunamadi
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Sectiginiz kriterlere uygun isim bulunamadi.
                    Filtreleri genisleterek daha fazla sonuc gorebilirsiniz.
                  </p>
                  <button
                    onClick={() => goToStep(2)}
                    className="btn-primary gap-2 !px-6"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Kriterleri Degistir
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
