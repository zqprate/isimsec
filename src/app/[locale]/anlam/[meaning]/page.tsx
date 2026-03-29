"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { searchNames, getCategoryName } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { NameCard } from "@/components/name/NameCard";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ui/ScrollReveal";

export default function MeaningPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { meaning } = useParams<{ meaning: string }>();
  const names = useMemo(
    () => searchNames(locale as Locale, { meaningCategories: [meaning], sort: "popularity" }),
    [meaning, locale]
  );
  const catName = getCategoryName(meaning, locale as Locale);

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal blur>
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">
              &ldquo;{catName}&rdquo; Anlamındaki İsimler
            </h1>
            <p className="mt-4 text-slate-500 text-lg">
              {catName} anlamına gelen {names.length} isim
            </p>
          </div>
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {names.map((name) => (
            <StaggerItem key={name.slug}>
              <NameCard name={name} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerReveal>

        {names.length === 0 && (
          <div className="text-center py-20 text-slate-400">{t("noResults")}</div>
        )}
      </div>
    </main>
  );
}
