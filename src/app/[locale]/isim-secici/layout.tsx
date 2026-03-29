import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolPageJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İsim Seçici — Kriterlerinize Göre İsim Bulun | İsimSeç",
  description: "Cinsiyet, harf, hece sayısı, köken ve anlam kriterlerine göre bebeğinize en uygun ismi bulun. İnteraktif isim seçme aracı.",
  openGraph: {
    title: "İsim Seçici — Kriterlerinize Göre İsim Bulun",
    description: "Cinsiyet, köken ve anlam kriterlerine göre isim bulun.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={toolPageJsonLd({
        name: "İsim Seçici",
        description: "Cinsiyet, harf, hece, köken ve anlam kriterlerine göre bebek ismi bulan ücretsiz interaktif araç.",
        url: "https://www.isimsec.com/isim-secici",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "İsim Seçici", url: "https://www.isimsec.com/isim-secici" },
      ])} />
      <JsonLd data={faqPageJsonLd([
        { question: "İsim seçici nasıl çalışır?", answer: "3 adımda çalışır: cinsiyet seçin, tercihlerinizi belirleyin (harf, hece, köken, anlam), ve kriterlerinize uyan isimler listelenir." },
        { question: "İsim seçici ücretsiz mi?", answer: "Evet, tamamen ücretsiz ve kayıt gerektirmez." },
      ])} />
      {children}
    </>
  );
}
