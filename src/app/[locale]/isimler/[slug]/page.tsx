import { notFound } from "next/navigation";
import {
  getNameBySlug,
  getSimilarNames,
  getOriginName,
  getCategoryName,
  type NameEntry,
} from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  namePageJsonLd,
  breadcrumbJsonLd,
  hreflangAlternates,
  faqPageJsonLd,
} from "@/lib/seo";
import {
  Heart,
  Volume2,
  BookOpen,
  Globe2,
  Hash,
  TrendingUp,
  Users,
  ScrollText,
} from "lucide-react";
import type { Metadata } from "next";

/* ── Types ───────────────────────────────── */

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/* ── SEO Metadata ────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = getNameBySlug(slug, locale as Locale);
  if (!name) return { title: "Not Found" };

  return {
    title: name.translation.metaTitle || `${name.name} İsminin Anlamı`,
    description:
      name.translation.metaDescription || name.translation.meaning,
    alternates: {
      canonical: `https://www.isimsec.com/${locale}/isimler/${slug}`,
      languages: hreflangAlternates(`/isimler/${slug}`, [
        "tr",
        "en",
        "de",
        "ar",
      ]),
    },
    openGraph: {
      title: `${name.name} — İsimSeç`,
      description: name.translation.meaning,
      type: "article",
      locale: locale,
    },
  };
}

/* ── Helper: gender label & badge class ─── */

const genderConfig: Record<
  NameEntry["gender"],
  { label: string; className: string }
> = {
  male: { label: "Erkek", className: "badge-gender-male" },
  female: { label: "Kız", className: "badge-gender-female" },
  unisex: { label: "Unisex", className: "badge-gender-unisex" },
};

/* ── Page ─────────────────────────────────── */

export default async function NameDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const name = getNameBySlug(slug, locale as Locale);
  if (!name) notFound();

  const similarNames = getSimilarNames(name, locale as Locale);
  const gender = genderConfig[name.gender];
  const pageUrl = `https://www.isimsec.com/${locale}/isimler/${slug}`;
  const startingLetter = name.name[0].toUpperCase();
  const endingLetter = name.name[name.name.length - 1].toUpperCase();

  return (
    <main className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ═══════════════════════════════════
          JSON-LD Structured Data
          ═══════════════════════════════════ */}
      <JsonLd
        data={namePageJsonLd({
          name: name.name,
          meaning: name.translation.meaning,
          locale: locale as Locale,
          url: pageUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", url: `https://www.isimsec.com/${locale}` },
          {
            name: "İsimler",
            url: `https://www.isimsec.com/${locale}/isimler`,
          },
          { name: name.name, url: pageUrl },
        ])}
      />
      {/* Triple JSON-LD: Article + Breadcrumb + FAQPage (1.8x AI citations) */}
      <JsonLd
        data={faqPageJsonLd([
          {
            question: `${name.name} ismi ne demek?`,
            answer: `${name.name} ismi ${name.translation.meaning} anlamına gelir.${name.translation.description ? " " + name.translation.description.slice(0, 200) : ""}`,
          },
          {
            question: `${name.name} ismi hangi kökenden geliyor?`,
            answer: `${name.name}, ${name.origins.map((o) => getOriginName(o, locale as Locale)).join(" ve ")} kökenli bir isimdir.`,
          },
          ...(name.translation.famousPeople && name.translation.famousPeople.length > 0
            ? [{
                question: `${name.name} isminde hangi ünlüler var?`,
                answer: `${name.name} ismini taşıyan tanınmış kişiler: ${name.translation.famousPeople.join(", ")}.`,
              }]
            : []),
        ])}
      />

      {/* ═══════════════════════════════════
          Breadcrumb Navigation
          ═══════════════════════════════════ */}
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İsimler", href: "/isimler" },
          { label: name.name },
        ]}
      />

      {/* ═══════════════════════════════════
          Name Hero Section
          ═══════════════════════════════════ */}
      <section className="pt-24 pb-12 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-ocean-900 animate-fade-in">
          {name.name}
        </h1>

        {/* Gender + Origin badges */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span
            className={`${gender.className} px-3 py-1 text-sm font-medium rounded-pill`}
          >
            {gender.label}
          </span>
          {name.origins.map((origin) => (
            <span
              key={origin}
              className="px-3 py-1 text-sm font-medium rounded-pill bg-ocean-50 text-ocean-700 border border-ocean-100"
            >
              {getOriginName(origin, locale as Locale)}
            </span>
          ))}
        </div>

        {/* Pronunciation */}
        {name.translation.pronunciation && (
          <div className="mt-5 flex items-center justify-center gap-2 text-slate-500">
            <Volume2 className="h-4 w-4" />
            <span className="text-base italic">
              {name.translation.pronunciation}
            </span>
          </div>
        )}

        {/* Favorite button (visual only) */}
        <div className="mt-6">
          <button
            type="button"
            aria-label="Favorilere ekle"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill glass text-ocean-700 text-sm font-medium hover:bg-white/70 transition-all duration-300"
          >
            <Heart className="h-4 w-4" />
            Favorilere Ekle
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════
          GEO Citability Passage — İlk 200 kelimede doğrudan yanıt
          AI alıntılanabilirlik için 134-167 kelime, bağlamdan bağımsız
          ═══════════════════════════════════ */}
      <section className="mt-8 glass rounded-hero p-6 sm:p-8">
        <p className="text-slate-700 leading-relaxed text-base">
          <strong>{name.name}</strong> ismi{" "}
          <strong>{name.translation.meaning}</strong> anlamına gelir
          {name.origins.length > 0 &&
            ` ve ${name.origins.map((o) => getOriginName(o, locale as Locale)).join(", ")} kökenlidir`}
          .{" "}
          {name.gender === "male"
            ? "Erkek bebek ismi olarak kullanılır"
            : name.gender === "female"
            ? "Kız bebek ismi olarak kullanılır"
            : "Hem kız hem erkek ismi olarak kullanılır"}
          .{" "}
          {name.syllableCount} heceli ve {name.letterCount} harfli olan {name.name},{" "}
          {name.isPopular
            ? `popülerlik sıralamasında ${name.popularityRank}. sırada yer almaktadır`
            : "az tercih edilen bir isimdir"}
          .{" "}
          {name.translation.description
            ? name.translation.description.slice(0, 300)
            : ""}
          {name.translation.famousPeople && name.translation.famousPeople.length > 0 &&
            ` Bu ismi taşıyan tanınmış kişiler arasında ${name.translation.famousPeople.slice(0, 3).join(", ")} bulunmaktadır.`}
          {" "}
          <span className="text-slate-400 text-sm">
            (Kaynak: İsimSeç veritabanı, TÜİK ve BehindTheName verileri)
          </span>
        </p>
      </section>

      {/* ═══════════════════════════════════
          Info Cards Grid
          ═══════════════════════════════════ */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Anlam ── */}
        {name.translation.meaning && (
          <div className="glass rounded-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-ocean-500" />
              </div>
              <h2 className="text-ocean-700 font-display font-semibold text-lg">
                Anlam
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {name.translation.meaning}
            </p>
            {name.translation.description && (
              <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-6">
                {name.translation.description}
              </p>
            )}
          </div>
        )}

        {/* ── Köken ── */}
        {name.origins.length > 0 && (
          <div className="glass rounded-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
                <Globe2 className="h-4 w-4 text-ocean-500" />
              </div>
              <h2 className="text-ocean-700 font-display font-semibold text-lg">
                Köken
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {name.origins.map((origin) => (
                <a
                  key={origin}
                  href={`/${locale}/koken/${origin}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-ocean-50/80 text-ocean-700 text-sm font-medium border border-ocean-100/60 hover:bg-ocean-100 transition-colors duration-200"
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  {getOriginName(origin, locale as Locale)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Özellikler ── */}
        <div className="glass rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
              <Hash className="h-4 w-4 text-ocean-500" />
            </div>
            <h2 className="text-ocean-700 font-display font-semibold text-lg">
              Özellikler
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="clay-inset p-3 text-center">
              <span className="block text-xs text-slate-400 mb-1">
                Hece Sayısı
              </span>
              <span className="text-lg font-display font-bold text-ocean-800">
                {name.syllableCount}
              </span>
            </div>
            <div className="clay-inset p-3 text-center">
              <span className="block text-xs text-slate-400 mb-1">
                Harf Sayısı
              </span>
              <span className="text-lg font-display font-bold text-ocean-800">
                {name.letterCount}
              </span>
            </div>
            <div className="clay-inset p-3 text-center">
              <span className="block text-xs text-slate-400 mb-1">
                Başlangıç Harfi
              </span>
              <span className="text-lg font-display font-bold text-ocean-800">
                {startingLetter}
              </span>
            </div>
            <div className="clay-inset p-3 text-center">
              <span className="block text-xs text-slate-400 mb-1">
                Bitiş Harfi
              </span>
              <span className="text-lg font-display font-bold text-ocean-800">
                {endingLetter}
              </span>
            </div>
          </div>
        </div>

        {/* ── Popülerlik ── */}
        <div className="glass rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-ocean-500" />
            </div>
            <h2 className="text-ocean-700 font-display font-semibold text-lg">
              Popülerlik
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="clay-inset p-3 text-center flex-1">
              <span className="block text-xs text-slate-400 mb-1">Sıralama</span>
              <span className="text-2xl font-display font-bold text-ocean-800">
                #{name.popularityRank}
              </span>
            </div>
            {name.isPopular && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-gold-50 text-gold-500 text-sm font-medium border border-gold-200">
                <TrendingUp className="h-3.5 w-3.5" />
                Popüler
              </span>
            )}
          </div>
        </div>

        {/* ── Ünlü Kişiler ── */}
        {name.translation.famousPeople &&
          name.translation.famousPeople.length > 0 && (
            <div className="glass rounded-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-ocean-500" />
                </div>
                <h2 className="text-ocean-700 font-display font-semibold text-lg">
                  Ünlü Kişiler
                </h2>
              </div>
              <ul className="space-y-2">
                {name.translation.famousPeople.map((person, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ocean-300 flex-shrink-0" />
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* ── Kültürel Notlar ── */}
        {name.translation.culturalNotes && (
          <div className="glass rounded-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ocean-50 flex items-center justify-center">
                <ScrollText className="h-4 w-4 text-ocean-500" />
              </div>
              <h2 className="text-ocean-700 font-display font-semibold text-lg">
                Kültürel Notlar
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-6">
              {name.translation.culturalNotes}
            </p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════
          Benzer İsimler
          ═══════════════════════════════════ */}
      {similarNames.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ocean-900 mb-6">
            Benzer İsimler
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
            {similarNames.map((similar) => (
              <a
                key={similar.slug}
                href={`/${locale}/isimler/${similar.slug}`}
                className="glass rounded-card p-4 min-w-[140px] text-center flex-shrink-0 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <span className="block text-lg font-display font-bold text-ocean-800">
                  {similar.name}
                </span>
                <span className="block mt-1.5 text-xs text-slate-500 line-clamp-2">
                  {similar.translation.meaning}
                </span>
                <span
                  className={`inline-block mt-2 ${genderConfig[similar.gender].className} px-2 py-0.5 text-xs font-medium rounded-pill`}
                >
                  {genderConfig[similar.gender].label}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          Internal Links (SEO)
          ═══════════════════════════════════ */}
      <section className="mt-16">
        <h2 className="text-xl font-display font-semibold text-ocean-800 mb-4">
          Keşfetmeye Devam Et
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* Same starting letter */}
          <a
            href={`/${locale}/harf/${startingLetter.toLowerCase()}`}
            className="chip hover:shadow-card"
          >
            <Hash className="h-3.5 w-3.5" />
            {startingLetter} harfiyle başlayan isimler
          </a>

          {/* Same origin links */}
          {name.origins.map((origin) => (
            <a
              key={origin}
              href={`/${locale}/koken/${origin}`}
              className="chip hover:shadow-card"
            >
              <Globe2 className="h-3.5 w-3.5" />
              {getOriginName(origin, locale as Locale)} kökenli isimler
            </a>
          ))}

          {/* Meaning category links */}
          {name.meaningCategories.map((cat) => (
            <a
              key={cat}
              href={`/${locale}/anlam/${cat}`}
              className="chip hover:shadow-card"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {getCategoryName(cat, locale as Locale)}
            </a>
          ))}

          {/* Gender-specific browse */}
          {name.gender !== "unisex" && (
            <a
              href={`/${locale}/${name.gender === "male" ? "erkek-isimleri" : "kiz-isimleri"}`}
              className="chip hover:shadow-card"
            >
              <Users className="h-3.5 w-3.5" />
              {name.gender === "male" ? "Erkek İsimleri" : "Kız İsimleri"}
            </a>
          )}

          {/* Popular names */}
          {name.isPopular && (
            <a
              href={`/${locale}/populer-isimler`}
              className="chip hover:shadow-card"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Popüler İsimler
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
