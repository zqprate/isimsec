import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, localeDirections } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  DatasetJsonLd,
} from "@/components/seo/OrganizationJsonLd";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AdSenseScript } from "@/components/analytics/AdSenseScript";
import "../globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.isimsec.com"),
  title: {
    template: "%s | İsimSeç",
    default: "İsimSeç — Bebeğinize Mükemmel İsmi Seçin",
  },
  description:
    "Bebek ismi arıyorsanız doğru yerdesiniz. 643+ ismin anlamı, kökeni ve popülerliği. Soyadı uyumu testi, isim karşılaştırma ve daha fazlası.",
  openGraph: {
    type: "website",
    siteName: "İsimSeç",
    locale: "tr_TR",
    images: [
      {
        url: "https://www.isimsec.com/og-image.svg",
        width: 1200,
        height: 630,
        alt: "İsimSeç — Bebek İsmi Keşif Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "İsimSeç — Bebeğinize Mükemmel İsmi Seçin",
    description: "643+ isim, 4 dil, interaktif araçlar. Soyadı uyumu, isim karşılaştırma ve daha fazlası.",
    images: ["https://www.isimsec.com/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = localeDirections[locale as Locale] ?? "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${bricolage.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-body text-slate-700 antialiased">
        <GoogleAnalytics />
        <AdSenseScript />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <DatasetJsonLd />
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as Locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
