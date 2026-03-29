"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import {
  searchNames,
  getAllNames,
  origins,
  meaningCategories,
  type NameEntry,
  type NameFilters,
} from "@/lib/names";
import { NameCard } from "@/components/name/NameCard";
import type { Locale } from "@/i18n/routing";
import {
  ScrollReveal,
  StaggerReveal,
  StaggerItem,
} from "@/components/ui/ScrollReveal";

/* ── Helpers ───────────────────────────────── */

const turkishAlphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

function getOriginLabel(slug: string): string {
  const o = origins.find((x) => x.slug === slug);
  return o?.translations.tr?.name ?? slug;
}

function getCategoryLabel(slug: string): string {
  const c = meaningCategories.find((x) => x.slug === slug);
  return c?.translations.tr ?? slug;
}

/* ── Page ──────────────────────────────────── */

export default function IsimlerPage() {
  const t = useTranslations("common");
  const tFinder = useTranslations("nameFinder");
  const locale = useLocale() as Locale;

  /* State */
  const [filters, setFilters] = useState<NameFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const results = useMemo(() => searchNames(locale, filters), [locale, filters]);

  /* Filter update */
  function updateFilter<K extends keyof NameFilters>(
    key: K,
    value: NameFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayFilter(
    key: "origins" | "meaningCategories",
    value: string
  ) {
    setFilters((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  function clearFilters() {
    setFilters({});
  }

  const hasActiveFilters =
    filters.gender ||
    filters.startingLetter ||
    (filters.origins && filters.origins.length > 0) ||
    (filters.meaningCategories && filters.meaningCategories.length > 0) ||
    filters.query;

  return (
    <main className="pt-24 pb-20 relative">
      {/* Ambient background orbs */}
      <div className="orb orb-ocean w-[500px] h-[500px] -top-40 -right-32 opacity-40 fixed" />
      <div className="orb orb-gold w-[350px] h-[350px] top-1/3 -left-24 opacity-25 fixed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════
            PAGE HEADER
            ═══════════════════════════════════ */}
        <ScrollReveal blur>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ocean-900 tracking-tight">
              {t("boy") === "Erkek" ? "İsimler" : "Names"}
            </h1>
            <p className="mt-3 text-slate-500 text-lg">
              {tFinder("resultsFound", { count: String(results.length) })}
            </p>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════
            SEARCH + FILTER BAR
            Sticky under navbar
            ═══════════════════════════════════ */}
        <div className="sticky top-16 z-30 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 backdrop-blur-xl bg-white/60">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ocean-200/40 via-gold-200/20 to-ocean-200/40 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative input-glass flex items-center h-12 px-4">
                <Search className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={filters.query ?? ""}
                  onChange={(e) => updateFilter("query", e.target.value || undefined)}
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 h-full px-3 bg-transparent text-sm sm:text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                {filters.query && (
                  <button
                    onClick={() => updateFilter("query", undefined)}
                    className="p-1 rounded-full hover:bg-white/60 transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 h-12 rounded-button font-medium text-sm transition-all duration-300 cursor-pointer ${
                showFilters
                  ? "bg-ocean-500 text-white shadow-elevated"
                  : "btn-ghost"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">{t("filter")}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
              )}
            </motion.button>

            {/* View mode toggle */}
            <div className="flex items-center rounded-button overflow-hidden border border-ocean-100/50 bg-white/60 backdrop-blur-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-ocean-50 text-ocean-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-ocean-50 text-ocean-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════
            FILTER PANEL (collapsible)
            ═══════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : 0,
            opacity: showFilters ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="overflow-hidden"
        >
          <div className="glass-strong rounded-hero p-6 mt-4 space-y-6">
            {/* Gender toggle */}
            <div>
              <h3 className="text-sm font-semibold text-ocean-800 mb-3 font-display">
                {tFinder("step1Title")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "male", label: t("boy") },
                    { value: "female", label: t("girl") },
                    { value: "unisex", label: t("unisex") },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.value}
                    onClick={() =>
                      updateFilter(
                        "gender",
                        filters.gender === g.value ? null : g.value
                      )
                    }
                    className={`${
                      filters.gender === g.value ? "chip-active" : "chip"
                    } cursor-pointer`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Starting letter */}
            <div>
              <h3 className="text-sm font-semibold text-ocean-800 mb-3 font-display">
                {tFinder("startingLetter")}
              </h3>
              <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-1.5">
                {turkishAlphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() =>
                      updateFilter(
                        "startingLetter",
                        filters.startingLetter === letter ? null : letter
                      )
                    }
                    className={`h-9 rounded-button text-sm font-medium transition-all duration-200 cursor-pointer ${
                      filters.startingLetter === letter
                        ? "chip-active"
                        : "chip"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin filter */}
            <div>
              <h3 className="text-sm font-semibold text-ocean-800 mb-3 font-display">
                {tFinder("selectOrigin")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {origins.map((origin) => (
                  <button
                    key={origin.slug}
                    onClick={() => toggleArrayFilter("origins", origin.slug)}
                    className={`${
                      filters.origins?.includes(origin.slug)
                        ? "chip-active"
                        : "chip"
                    } cursor-pointer`}
                  >
                    {getOriginLabel(origin.slug)}
                  </button>
                ))}
              </div>
            </div>

            {/* Meaning category filter */}
            <div>
              <h3 className="text-sm font-semibold text-ocean-800 mb-3 font-display">
                {tFinder("selectMeaning")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {meaningCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() =>
                      toggleArrayFilter("meaningCategories", cat.slug)
                    }
                    className={`${
                      filters.meaningCategories?.includes(cat.slug)
                        ? "chip-active"
                        : "chip"
                    } cursor-pointer`}
                  >
                    {getCategoryLabel(cat.slug)}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 border-t border-ocean-100/40"
              >
                <button
                  onClick={clearFilters}
                  className="btn-ghost text-sm font-medium text-coral-500 hover:text-coral-600 flex items-center gap-2 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  {tFinder("changeCriteria")}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════
            RESULTS
            ═══════════════════════════════════ */}
        <div className="mt-8">
          {/* Result count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-ocean-700">
                {results.length}
              </span>{" "}
              isim bulundu
            </p>
          </div>

          {results.length > 0 ? (
            <StaggerReveal
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "grid grid-cols-1 gap-3"
              }
            >
              {results.map((name) => (
                <StaggerItem key={name.slug}>
                  <NameCard name={name} locale={locale} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          ) : (
            <ScrollReveal>
              <div className="glass-strong rounded-hero p-12 sm:p-16 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center mb-5">
                  <Search className="h-7 w-7 text-ocean-300" />
                </div>
                <h3 className="text-xl font-display font-semibold text-ocean-800">
                  {t("noResults")}
                </h3>
                <p className="mt-2 text-slate-500 max-w-md mx-auto">
                  {tFinder("noMatch")}
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary mt-6 cursor-pointer"
                >
                  {tFinder("changeCriteria")}
                </button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </main>
  );
}
