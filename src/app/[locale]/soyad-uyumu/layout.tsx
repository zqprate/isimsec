import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soyadı Uyum Analizi — İsim ve Soyadı Uyumu Testi | İsimSeç",
  description:
    "Bebeğinizin ismi soyadınızla ne kadar uyumlu? 7 farklı kriter üzerinden fonetik uyum analizi yapın. Hece uyumu, ritim ve ses akışı analizi.",
  openGraph: {
    title: "Soyadı Uyum Analizi — İsim ve Soyadı Uyumu Testi",
    description:
      "İsim ve soyadı uyumunu 7 farklı kriter üzerinden fonetik olarak analiz edin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
