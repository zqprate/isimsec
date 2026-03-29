"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Globe, ChevronDown, Wrench } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localeNames, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LogoFull } from "@/components/ui/Logo";

/* ── Nav link with underline hover ── */
type NavHrefType = "/" | "/isimler" | "/erkek-isimleri" | "/kiz-isimleri" | "/populer-isimler" | "/isim-secici" | "/soyad-uyumu" | "/isim-karsilastir" | "/isim-kombinator" | "/ebeveyn-uyumu";

function NavLink({ href, children }: { href: NavHrefType; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-[13px] font-semibold text-slate-600 hover:text-ocean-600 transition-colors duration-200 py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-ocean-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tTools = useTranslations("home");

  type NavHref = "/" | "/isimler" | "/erkek-isimleri" | "/kiz-isimleri" | "/populer-isimler" | "/isim-secici" | "/soyad-uyumu" | "/isim-karsilastir" | "/isim-kombinator" | "/ebeveyn-uyumu";

  const navItems: { href: NavHref; label: string }[] = [
    { href: "/", label: t("home") },
    { href: "/isimler", label: t("names") },
    { href: "/erkek-isimleri", label: t("boyNames") },
    { href: "/kiz-isimleri", label: t("girlNames") },
  ];

  const toolItems: { href: NavHref; label: string }[] = [
    { href: "/isim-secici", label: tTools("toolNamePicker") },
    { href: "/soyad-uyumu", label: tTools("toolSurname") },
    { href: "/isim-karsilastir", label: tTools("toolCompare") },
    { href: "/isim-kombinator", label: tTools("toolCombinator") },
    { href: "/ebeveyn-uyumu", label: tTools("toolParent") },
  ];

  function switchLocale(newLocale: string) {
    router.replace(pathname as "/", { locale: newLocale });
    setLangOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav
        className={`mx-auto mt-0 transition-all duration-500 ease-out ${
          scrolled
            ? "mt-3 max-w-4xl mx-4 sm:mx-auto glass-strong rounded-hero shadow-elevated"
            : "max-w-full glass-navbar"
        }`}
      >
        <div className={`flex h-16 items-center justify-between transition-all duration-500 ${
          scrolled ? "px-5" : "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        }`}>
          {/* Logo */}
          <Link href={"/" as "/"} className="flex-shrink-0 flex items-center">
            <LogoFull size={36} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="relative text-[13px] font-semibold text-slate-600 hover:text-ocean-600 transition-colors duration-200 py-1 flex items-center gap-1"
              >
                <Wrench className="h-3.5 w-3.5" />
                {t("tools")}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                      className="absolute left-0 mt-2 w-52 glass-strong rounded-card overflow-hidden z-50 shadow-elevated"
                    >
                      {toolItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setToolsOpen(false)}
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:text-ocean-600 hover:bg-white/50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Favorites */}
            <Link
              href={"/isimler" as "/isimler"}
              className="relative p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="h-[18px] w-[18px] text-slate-500" />
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-slate-600 rounded-pill hover:bg-white/50 transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{localeNames[locale]}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                      className="absolute right-0 mt-2 w-40 glass-strong rounded-card overflow-hidden z-50 shadow-elevated"
                    >
                      {(Object.entries(localeNames) as [Locale, string][]).map(
                        ([code, name]) => (
                          <button
                            key={code}
                            onClick={() => switchLocale(code)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              locale === code
                                ? "text-ocean-600 bg-ocean-50/50 font-medium"
                                : "text-slate-600 hover:bg-white/50"
                            }`}
                          >
                            {name}
                          </button>
                        )
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-button hover:bg-white/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-slate-600" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="md:hidden border-t border-white/20 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 rounded-button hover:bg-white/50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-2 mt-2 border-t border-white/20">
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-ocean-500">{t("tools")}</p>
                  {toolItems.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + i) * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-slate-700 rounded-button hover:bg-white/50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
