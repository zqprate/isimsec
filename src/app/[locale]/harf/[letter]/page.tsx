"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { getNamesByLetter } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { NameCard } from "@/components/name/NameCard";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ui/ScrollReveal";

export default function LetterPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { letter } = useParams<{ letter: string }>();
  const names = useMemo(() => getNamesByLetter(letter, locale as Locale), [letter, locale]);

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal blur>
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl">
              {letter.toUpperCase()} {t("letters")}
            </h1>
            <p className="mt-4 text-slate-500 text-lg">
              {letter.toUpperCase()} harfiyle başlayan {names.length} isim
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
          <div className="text-center py-20 text-slate-400">
            {t("noResults")}
          </div>
        )}
      </div>
    </main>
  );
}
