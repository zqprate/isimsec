import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İsimler — Tüm Bebek İsimleri | İsimSeç",
  description:
    "13.000+ bebek ismi arasından arayın, filtreleyin ve keşfedin. Cinsiyet, köken, hece sayısı ve anlam kategorisine göre isim bulun.",
  openGraph: {
    title: "İsimler — Tüm Bebek İsimleri",
    description:
      "13.000+ isim veritabanında arayın ve filtreleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
