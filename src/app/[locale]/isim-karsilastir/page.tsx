"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Search, ArrowRight } from "lucide-react";
import {
  getNameBySlug,
  getAllNames,
  getOriginName,
} from "@/lib/names";
import type { NameEntry } from "@/lib/names";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Locale } from "@/i18n/routing";

/* ── Helpers ──────────────────────────────── */

function filterNames(query: string, allNames: NameEntry[]): NameEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return allNames
    .filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.slug.toLowerCase().includes(q)
    )
    .slice(0, 5);
}

function genderLabel(g: "male" | "female" | "unisex"): string {
  switch (g) {
    case "male":
      return "Erkek";
    case "female":
      return "Kız";
    case "unisex":
      return "Unisex";
  }
}

function genderBadgeClass(g: "male" | "female" | "unisex"): string {
  switch (g) {
    case "male":
      return "badge-gender-male";
    case "female":
      return "badge-gender-female";
    case "unisex":
      return "badge-gender-unisex";
  }
}

/* ── Animation Variants ───────────────────── */

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/* ── Comparison Row ───────────────────────── */

function ComparisonRow({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
}) {
  return (
    <motion.div
      variants={rowVariants}
      className="glass rounded-card p-5 grid grid-cols-[1fr_1.2fr_1.2fr] gap-4 items-center"
    >
      <span className="text-sm font-semibold text-ocean-700 tracking-wide">
        {label}
      </span>
      <span className="text-sm text-ocean-900 font-medium text-center">
        {value1}
      </span>
      <span className="text-sm text-ocean-900 font-medium text-center">
        {value2}
      </span>
    </motion.div>
  );
}

/* ── Page Component ───────────────────────── */

export default function IsimKarsilastirPage() {
  const t = useTranslations();
  const locale = useLocale();
  const allNames = getAllNames(locale as Locale);

  const [name1Query, setName1Query] = useState("");
  const [name2Query, setName2Query] = useState("");
  const [name1, setName1] = useState<NameEntry | null>(null);
  const [name2, setName2] = useState<NameEntry | null>(null);
  const [show1Dropdown, setShow1Dropdown] = useState(false);
  const [show2Dropdown, setShow2Dropdown] = useState(false);

  const suggestions1 = filterNames(name1Query, allNames);
  const suggestions2 = filterNames(name2Query, allNames);

  const showComparison = name1 && name2;

  function handleSelect1(entry: NameEntry) {
    setName1(entry);
    setName1Query(entry.name);
    setShow1Dropdown(false);
  }

  function handleSelect2(entry: NameEntry) {
    setName2(entry);
    setName2Query(entry.name);
    setShow2Dropdown(false);
  }

  function handleCompare() {
    if (!name1Query.trim() || !name2Query.trim()) return;

    // If user typed but did not select from dropdown, try to match
    if (!name1) {
      const match = allNames.find(
        (n) => n.name.toLowerCase() === name1Query.trim().toLowerCase()
      );
      if (match) setName1(match);
    }
    if (!name2) {
      const match = allNames.find(
        (n) => n.name.toLowerCase() === name2Query.trim().toLowerCase()
      );
      if (match) setName2(match);
    }
  }

  return (
    <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────── */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-pill glass-subtle text-sm font-medium text-ocean-600">
            <Scale className="w-4 h-4" />
            <span>Karşılaştırma Aracı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ocean-900 mb-3 tracking-tight">
            İsim Karşılaştır
          </h1>
          <p className="text-ocean-600 text-lg max-w-xl mx-auto leading-relaxed">
            İki ismi yan yana karşılaştırın
          </p>
        </div>
      </ScrollReveal>

      {/* ── Input Area ──────────────────────── */}
      <ScrollReveal delay={0.1}>
        <div className="glass-strong rounded-hero p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Name 1 Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-ocean-700 mb-2">
                1. İsim
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400 pointer-events-none" />
                <input
                  type="text"
                  value={name1Query}
                  onChange={(e) => {
                    setName1Query(e.target.value);
                    setName1(null);
                    setShow1Dropdown(true);
                  }}
                  onFocus={() => setShow1Dropdown(true)}
                  onBlur={() => setTimeout(() => setShow1Dropdown(false), 200)}
                  placeholder="İsim yazın..."
                  className="input-glass w-full pl-11 pr-4 py-3.5 text-sm text-ocean-900 placeholder:text-ocean-400"
                />
              </div>

              {/* Dropdown 1 */}
              <AnimatePresence>
                {show1Dropdown && suggestions1.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 left-0 right-0 mt-2 glass rounded-card overflow-hidden shadow-elevated"
                  >
                    {suggestions1.map((entry) => (
                      <button
                        key={entry.slug}
                        type="button"
                        onMouseDown={() => handleSelect1(entry)}
                        className="w-full text-left px-4 py-3 text-sm text-ocean-800 hover:bg-ocean-50/60 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-xs text-ocean-500 truncate ml-2 max-w-[140px]">
                          {entry.translation.meaning}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Name 2 Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-ocean-700 mb-2">
                2. İsim
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400 pointer-events-none" />
                <input
                  type="text"
                  value={name2Query}
                  onChange={(e) => {
                    setName2Query(e.target.value);
                    setName2(null);
                    setShow2Dropdown(true);
                  }}
                  onFocus={() => setShow2Dropdown(true)}
                  onBlur={() => setTimeout(() => setShow2Dropdown(false), 200)}
                  placeholder="İsim yazın..."
                  className="input-glass w-full pl-11 pr-4 py-3.5 text-sm text-ocean-900 placeholder:text-ocean-400"
                />
              </div>

              {/* Dropdown 2 */}
              <AnimatePresence>
                {show2Dropdown && suggestions2.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 left-0 right-0 mt-2 glass rounded-card overflow-hidden shadow-elevated"
                  >
                    {suggestions2.map((entry) => (
                      <button
                        key={entry.slug}
                        type="button"
                        onMouseDown={() => handleSelect2(entry)}
                        className="w-full text-left px-4 py-3 text-sm text-ocean-800 hover:bg-ocean-50/60 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-xs text-ocean-500 truncate ml-2 max-w-[140px]">
                          {entry.translation.meaning}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCompare}
              className="btn-primary px-10 gap-3"
            >
              <Scale className="w-4.5 h-4.5" />
              Karşılaştır
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Comparison Table ────────────────── */}
      <AnimatePresence mode="wait">
        {showComparison && (
          <motion.div
            key={`${name1.slug}-${name2.slug}`}
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Column Headers */}
            <motion.div
              variants={rowVariants}
              className="grid grid-cols-[1fr_1.2fr_1.2fr] gap-4 mb-6 px-5"
            >
              <div />
              <div className="text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ocean-900">
                  {name1.name}
                </h2>
              </div>
              <div className="text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ocean-900">
                  {name2.name}
                </h2>
              </div>
            </motion.div>

            {/* Rows */}
            <div className="space-y-3">
              {/* Anlam */}
              <ComparisonRow
                label="Anlam"
                value1={name1.translation.meaning}
                value2={name2.translation.meaning}
              />

              {/* Cinsiyet */}
              <ComparisonRow
                label="Cinsiyet"
                value1={
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${genderBadgeClass(name1.gender)}`}
                  >
                    {genderLabel(name1.gender)}
                  </span>
                }
                value2={
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${genderBadgeClass(name2.gender)}`}
                  >
                    {genderLabel(name2.gender)}
                  </span>
                }
              />

              {/* Köken */}
              <ComparisonRow
                label="Köken"
                value1={
                  <span className="flex flex-wrap justify-center gap-1.5">
                    {name1.origins.map((o) => (
                      <span
                        key={o}
                        className="chip text-xs !py-1 !px-2.5"
                      >
                        {getOriginName(o, locale as Locale)}
                      </span>
                    ))}
                  </span>
                }
                value2={
                  <span className="flex flex-wrap justify-center gap-1.5">
                    {name2.origins.map((o) => (
                      <span
                        key={o}
                        className="chip text-xs !py-1 !px-2.5"
                      >
                        {getOriginName(o, locale as Locale)}
                      </span>
                    ))}
                  </span>
                }
              />

              {/* Hece Sayısı */}
              <ComparisonRow
                label="Hece Sayısı"
                value1={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    {name1.syllableCount}
                  </span>
                }
                value2={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    {name2.syllableCount}
                  </span>
                }
              />

              {/* Harf Sayısı */}
              <ComparisonRow
                label="Harf Sayısı"
                value1={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    {name1.letterCount}
                  </span>
                }
                value2={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    {name2.letterCount}
                  </span>
                }
              />

              {/* Popülerlik Sırası */}
              <ComparisonRow
                label="Popülerlik Sırası"
                value1={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    #{name1.popularityRank}
                  </span>
                }
                value2={
                  <span className="font-display text-lg font-bold text-ocean-700">
                    #{name2.popularityRank}
                  </span>
                }
              />

              {/* Ünlü Kişiler */}
              <ComparisonRow
                label="Ünlü Kişiler"
                value1={
                  name1.translation.famousPeople &&
                  name1.translation.famousPeople.length > 0 ? (
                    <ul className="space-y-1">
                      {name1.translation.famousPeople.map((person, i) => (
                        <li
                          key={i}
                          className="text-xs text-ocean-700 leading-relaxed"
                        >
                          {person}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-ocean-400 italic">
                      Bilgi yok
                    </span>
                  )
                }
                value2={
                  name2.translation.famousPeople &&
                  name2.translation.famousPeople.length > 0 ? (
                    <ul className="space-y-1">
                      {name2.translation.famousPeople.map((person, i) => (
                        <li
                          key={i}
                          className="text-xs text-ocean-700 leading-relaxed"
                        >
                          {person}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-ocean-400 italic">
                      Bilgi yok
                    </span>
                  )
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
