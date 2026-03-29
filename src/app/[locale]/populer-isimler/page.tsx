"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { searchNames } from "@/lib/names";
import type { Locale } from "@/i18n/routing";
import { NameCard } from "@/components/name/NameCard";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ui/ScrollReveal";
import { TrendingUp } from "lucide-react";

export default function PopularNamesPage() {
  const tHome = useTranslations("home");
  const locale = useLocale();
  const names = useMemo(() => searchNames(locale as Locale, { onlyPopular: true, sort: "popularity" }), [locale]);

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal blur>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-coral-50 text-coral-500 text-sm font-medium mb-4 border border-coral-100">
              <TrendingUp className="h-4 w-4" />
              Trend
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">{tHome("popularNames")}</h1>
            <p className="mt-4 text-slate-500 text-lg">
              En çok tercih edilen {names.length} isim
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
