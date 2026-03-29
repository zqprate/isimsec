import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İsim Seçici — Kriterlerinize Göre İsim Bulun | İsimSeç",
  description:
    "Cinsiyet, harf, hece sayısı, köken ve anlam kriterlerine göre bebeğinize en uygun ismi bulun. İnteraktif isim seçme aracı.",
  openGraph: {
    title: "İsim Seçici — Kriterlerinize Göre İsim Bulun",
    description:
      "Cinsiyet, harf, hece sayısı, köken ve anlam kriterlerine göre isim bulun.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
