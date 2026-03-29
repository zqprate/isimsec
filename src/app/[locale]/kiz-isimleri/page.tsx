"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getNamesByGender } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { NameCard } from "@/components/name/NameCard";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ui/ScrollReveal";

export default function GirlNamesPage() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const names = useMemo(() => getNamesByGender("female", locale as Locale), [locale]);

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal blur>
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">{tNav("girlNames")}</h1>
            <p className="mt-4 text-slate-500 text-lg">
              {names.length} {t("girl").toLowerCase()} ismi listeleniyor
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
      </div>
    </main>
  );
}
