"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Heart, ArrowUpRight, Baby, Globe2, Wrench, Info } from "lucide-react";
import { LogoFull } from "@/components/ui/Logo";
import type { ReactNode } from "react";

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const sections = [
    {
      icon: Baby,
      title: t("explore"),
      links: [
        { href: "/isimler" as const, label: tNav("names") },
        { href: "/erkek-isimleri" as const, label: tNav("boyNames") },
        { href: "/kiz-isimleri" as const, label: tNav("girlNames") },
        { href: "/populer-isimler" as const, label: tNav("popular") },
        { href: "/blog" as const, label: "Blog" },
      ],
    },
    {
      icon: Wrench,
      title: t("tools"),
      links: [
        { href: "/isim-secici" as const, label: "İsim Seçici" },
        { href: "/soyad-uyumu" as const, label: "Soyadı Uyumu" },
        { href: "/isim-karsilastir" as const, label: "İsim Karşılaştır" },
        { href: "/isim-kombinator" as const, label: "İsim Kombinator" },
        { href: "/ebeveyn-uyumu" as const, label: "Ebeveyn Uyumu" },
      ],
    },
    {
      icon: Globe2,
      title: "Diller",
      links: [
        { href: "/" as const, label: "Türkçe", locale: "tr" },
        { href: "/" as const, label: "English", locale: "en" },
        { href: "/" as const, label: "Deutsch", locale: "de" },
        { href: "/" as const, label: "العربية", locale: "ar" },
      ],
    },
    {
      icon: Info,
      title: t("about"),
      links: [
        { href: "/hakkimizda" as const, label: tNav("about") },
        { href: "/iletisim" as const, label: tNav("contact") },
        { href: "/blog" as const, label: tNav("blog") },
        { href: "/gizlilik" as const, label: t("privacy") },
        { href: "/kullanim-sartlari" as const, label: t("terms") },
      ],
    },
  ];

  return (
    <footer className="relative mt-10 border-t border-ocean-100/40">
      {/* Soft gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-ocean-50/50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="pt-12 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand column */}
            <FadeIn className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <LogoFull size={28} />
              <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-[240px]">
                Bebek ismi araştırması yapan aileler için çok dilli, interaktif isim keşif platformu.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-pill bg-ocean-50 text-ocean-600 border border-ocean-100/50">
                  643+ İsim
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-pill bg-gold-50 text-gold-500 border border-gold-100/50">
                  4 Dil
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-pill bg-coral-50 text-coral-500 border border-coral-100/50">
                  6 Araç
                </span>
              </div>
            </FadeIn>

            {/* Link columns */}
            {sections.map((section, i) => (
              <FadeIn key={section.title} delay={0.05 + i * 0.05}>
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ocean-800 mb-3">
                  <section.icon className="h-3.5 w-3.5 text-ocean-400" />
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-ocean-600 transition-colors duration-150"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ocean-100/30 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            {t("copyright", { year: String(year) })}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-2.5 w-2.5 text-coral-400 fill-coral-400" /> in Türkiye
            </span>
            <span>·</span>
            <span>Veri: TÜİK, SSA, BehindTheName</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
