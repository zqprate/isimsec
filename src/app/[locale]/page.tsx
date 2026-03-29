"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Sparkles,
  Scale,
  Heart,
  Shuffle,
  Users,
  Dices,
  ArrowRight,
  BookOpen,
  Globe2,
  Hash,
  TrendingUp,
  LayoutGrid,
  Star,
  Baby,
  ChevronRight,
  Quote,
} from "lucide-react";
import {
  ScrollReveal,
  StaggerReveal,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getAllNames, type NameEntry } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { useMemo } from "react";

/* ── Hero word stagger ─────────────────── */
function HeroTitle({ text }: { text: string }) {
  const words = text.split(" ");
  const shouldReduce = useReducedMotion();
  return (
    <h1 className="text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.08] tracking-tight font-extrabold">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduce ? {} : { opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

/* ── Tool icons ────────────────────────── */
const toolIcons: Record<string, typeof Sparkles> = {
  toolNamePicker: Sparkles,
  toolCompare: Scale,
  toolSurname: Heart,
  toolCombinator: Shuffle,
  toolParent: Users,
  toolRandom: Dices,
};

/* ── Category icons ────────────────────── */
const catIcons: Record<string, typeof BookOpen> = {
  categoryByLetter: Hash,
  categoryByOrigin: Globe2,
  categoryByMeaning: BookOpen,
  categoryByPopularity: TrendingUp,
  categoryBySyllable: LayoutGrid,
  categoryNew: Star,
};

/* ── Name mini card (for popular names section) ── */
function NameMiniCard({ name }: { name: NameEntry }) {
  const genderColor = name.gender === "male" ? "text-ocean-500" : name.gender === "female" ? "text-coral-400" : "text-gold-500";
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass rounded-card p-4 min-w-[150px] cursor-pointer group"
    >
      <div className="text-lg font-bold font-display text-ocean-900 group-hover:text-ocean-600 transition-colors">
        {name.name}
      </div>
      <div className={`text-xs font-semibold mt-0.5 ${genderColor}`}>
        {name.gender === "male" ? "Erkek" : name.gender === "female" ? "Kız" : "Unisex"}
      </div>
      <div className="text-xs text-slate-500 mt-1.5 line-clamp-1">{name.translation.meaning}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
  const t = useTranslations("common");
  const tHome = useTranslations("home");
  const tSeo = useTranslations("homeSeo");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const popularNames = useMemo(() => getAllNames(locale as Locale).slice(0, 12), [locale]);
  const boyNames = useMemo(() => getAllNames(locale as Locale).filter(n => n.gender === "male").slice(0, 4), [locale]);
  const girlNames = useMemo(() => getAllNames(locale as Locale).filter(n => n.gender === "female").slice(0, 4), [locale]);

  const tools = [
    { key: "toolNamePicker", desc: "toolNamePickerDesc" },
    { key: "toolCompare", desc: "toolCompareDesc" },
    { key: "toolSurname", desc: "toolSurnameDesc" },
    { key: "toolCombinator", desc: "toolCombinatorDesc" },
    { key: "toolParent", desc: "toolParentDesc" },
    { key: "toolRandom", desc: "toolRandomDesc" },
  ];

  const categories = [
    "categoryByLetter", "categoryByOrigin", "categoryByMeaning",
    "categoryByPopularity", "categoryBySyllable", "categoryNew",
  ];

  return (
    <main className="pt-16">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="orb orb-ocean w-[500px] h-[500px] -top-20 -left-16 opacity-50" />
        <div className="orb orb-gold w-[350px] h-[350px] top-1/3 -right-12 opacity-40" />
        <div className="orb orb-coral w-[250px] h-[250px] bottom-8 left-1/4 opacity-25" />
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-ocean-50 text-ocean-600 text-xs font-bold mb-5 border border-ocean-100"
              >
                <Baby className="h-3.5 w-3.5" />
                643+ isim, 4 dil, 6 interaktif araç
              </motion.div>

              <HeroTitle text={tHome("heroTitle")} />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="mt-5 text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed"
              >
                Cinsiyet, köken, hece sayısı ve anlam kriterine göre filtreleyin.
                Soyadınızla uyumunu test edin. İki ismi karşılaştırın.
              </motion.p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
                className="mt-7 max-w-lg"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-ocean-200/40 via-gold-200/20 to-ocean-200/40 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                  <div className="relative input-glass flex items-center h-14 px-4 gradient-border rounded-card">
                    <Search className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      className="flex-1 h-full px-3 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button className="btn-primary px-4 py-2 text-xs !min-h-0 !rounded-[10px]">
                      {t("search")}
                    </button>
                  </div>
                </div>

                {/* Chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["boy", "girl", "unisex", "popular"] as const).map((key, i) => (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + i * 0.05, ease: [0.16, 1, 0.3, 1] as const }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="chip text-xs cursor-pointer"
                    >
                      {t(key)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — featured names grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {popularNames.slice(0, 6).map((name, i) => (
                <motion.div
                  key={name.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.5 }}
                >
                  <NameMiniCard name={name} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-8">
        <ScrollReveal>
          <div className="mx-auto max-w-5xl px-4">
            <div className="glass-strong rounded-hero p-6 sm:p-8">
              <div className="grid grid-cols-4 divide-x divide-ocean-100/40">
                {[
                  { value: 643, suffix: "+", label: "İsim" },
                  { value: 4, suffix: "", label: "Dil" },
                  { value: 15, suffix: "", label: "Köken" },
                  { value: 6, suffix: "", label: "Araç" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center px-2">
                    <div className="text-xl sm:text-3xl font-display font-extrabold text-ocean-800">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ POPULAR NAMES — Horizontal scroll ═══ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl">{tHome("popularNames")}</h2>
              <a href={`/${locale === "tr" ? "" : locale + "/"}${locale === "tr" ? "populer-isimler" : locale === "de" ? "beliebte-namen" : "popular-names"}`} className="text-sm font-semibold text-ocean-600 flex items-center gap-1 hover:gap-2 transition-all">
                {tHome("viewAll")} <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {popularNames.map((name) => (
              <NameMiniCard key={name.slug} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ERKEK + KIZ İSİMLERİ — Two columns ═══ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Erkek */}
            <ScrollReveal>
              <div className="glass rounded-hero p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-ocean-400" />
                    {tNav("boyNames")}
                  </h3>
                  <a href={`/${locale === "tr" ? "" : locale + "/"}${locale === "tr" ? "erkek-isimleri" : locale === "de" ? "jungennamen" : "boy-names"}`} className="text-xs font-semibold text-ocean-600">
                    Tümü <ChevronRight className="h-3 w-3 inline" />
                  </a>
                </div>
                <div className="space-y-2">
                  {boyNames.map((name) => (
                    <a key={name.slug} href={`/tr/isimler/${name.slug}`} className="flex items-center justify-between p-3 rounded-button hover:bg-white/50 transition-colors group">
                      <span className="font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors">{name.name}</span>
                      <span className="text-xs text-slate-400">{name.translation.meaning.slice(0, 30)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Kız */}
            <ScrollReveal delay={0.1}>
              <div className="glass rounded-hero p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
                    {tNav("girlNames")}
                  </h3>
                  <a href={`/${locale === "tr" ? "" : locale + "/"}${locale === "tr" ? "kiz-isimleri" : locale === "de" ? "maedchennamen" : "girl-names"}`} className="text-xs font-semibold text-ocean-600">
                    Tümü <ChevronRight className="h-3 w-3 inline" />
                  </a>
                </div>
                <div className="space-y-2">
                  {girlNames.map((name) => (
                    <a key={name.slug} href={`/tr/isimler/${name.slug}`} className="flex items-center justify-between p-3 rounded-button hover:bg-white/50 transition-colors group">
                      <span className="font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors">{name.name}</span>
                      <span className="text-xs text-slate-400">{name.translation.meaning.slice(0, 30)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ TOOLS ═══ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal blur>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl">{tHome("tools")}</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Kişisel verilerinizle çalışan, size özel sonuç üreten araçlar
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map(({ key, desc }) => {
              const Icon = toolIcons[key] || Sparkles;
              return (
                <StaggerItem key={key}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="clay-interactive p-5 h-full gradient-border card-tilt"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-ocean-50 flex items-center justify-center">
                        <Icon className="h-[18px] w-[18px] text-ocean-500" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-ocean-800">{tHome(key)}</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tHome(desc)}</p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-10 sm:py-14 relative">
        <div className="orb orb-ocean w-[500px] h-[500px] -bottom-32 -right-32 opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal blur>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl">{tHome("exploreByCategory")}</h2>
            </div>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((key) => {
              const Icon = catIcons[key] || BookOpen;
              return (
                <StaggerItem key={key}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="glass rounded-card p-5 text-center cursor-pointer group"
                  >
                    <div className="mx-auto w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center mb-3 group-hover:bg-ocean-100 transition-colors">
                      <Icon className="h-[18px] w-[18px] text-ocean-500" />
                    </div>
                    <h3 className="text-sm font-bold">{tHome(key)}</h3>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* ═══ SEO CONTENT BLOCK — Doğal, bilgilendirici ═══ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="glass rounded-hero p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl mb-4">{tSeo("howToChoose")}</h2>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>{tSeo("howToChooseP1")}</p>
                <p>{tSeo("howToChooseP2")}</p>
                <p>
                  {tSeo("howToChooseP3")}
                  <span className="text-slate-400 text-xs ml-1">{tSeo("sourceNote")}</span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ TESTIMONIAL / SOCIAL PROOF ═══ */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal blur>
            <div className="glass-strong rounded-hero p-6 sm:p-10 text-center">
              <Quote className="h-8 w-8 text-ocean-200 mx-auto mb-4" />
              <blockquote className="text-lg sm:text-xl font-display font-bold text-ocean-800 max-w-2xl mx-auto leading-relaxed">
                &ldquo;{tSeo("testimonial")}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-slate-500">{tSeo("testimonialAuthor")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FAQ — SEO + GEO Citability ═══ */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal blur>
            <h2 className="text-xl sm:text-2xl text-center mb-6">{tSeo("faq")}</h2>
          </ScrollReveal>

          <div className="space-y-3">
            {[
              { q: tSeo("faqCount"), a: tSeo("faqCountA") },
              { q: tSeo("faqHarmony"), a: tSeo("faqHarmonyA") },
              { q: tSeo("faqFree"), a: tSeo("faqFreeA") },
              { q: tSeo("faqSource"), a: tSeo("faqSourceA") },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <details className="glass rounded-card p-5 group cursor-pointer">
                  <summary className="flex items-center justify-between text-sm font-bold text-ocean-800 list-none">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-ocean-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-8 sm:py-10 pb-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-hero p-8 sm:p-12 text-center">
              <div className="absolute inset-0 bg-gradient-cta" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)"
              }} />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {tSeo("ctaTitle")}
                </h2>
                <p className="mt-3 text-ocean-100 text-sm max-w-md mx-auto">
                  {tSeo("ctaDesc")}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href={`/${locale === "tr" ? "" : locale + "/"}${locale === "tr" ? "isimler" : locale === "de" ? "namen" : "names"}`} className="bg-white text-ocean-700 font-bold px-6 py-3 rounded-button text-sm shadow-elevated hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                    {tSeo("ctaBrowse")}
                  </a>
                  <a href={`/${locale === "tr" ? "" : locale + "/"}${locale === "tr" ? "isim-secici" : locale === "de" ? "namenfinder" : "name-finder"}`} className="text-white/90 font-semibold px-6 py-3 rounded-button text-sm border border-white/25 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                    {tSeo("ctaFinder")}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
