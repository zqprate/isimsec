import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İsimler — Tüm Bebek İsimleri | İsimSeç",
  description: "1.600+ bebek ismi arasından arayın, filtreleyin ve keşfedin. Cinsiyet, köken, hece sayısı ve anlam kategorisine göre isim bulun.",
  openGraph: {
    title: "İsimler — Tüm Bebek İsimleri",
    description: "1.600+ isim veritabanında arayın ve filtreleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={collectionPageJsonLd({
        name: "Bebek İsimleri Veritabanı",
        description: "Türkçe, İngilizce, Almanca ve Arapça 1.600+ bebek ismi. Anlam, köken ve popülerlik bilgileriyle.",
        url: "https://www.isimsec.com/isimler",
        itemCount: 1646,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "İsimler", url: "https://www.isimsec.com/isimler" },
      ])} />
      {children}
    </>
  );
}
