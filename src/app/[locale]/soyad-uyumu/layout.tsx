import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolPageJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Soyadı Uyum Analizi — İsim ve Soyadı Uyumu Testi | İsimSeç",
  description:
    "Bebeğinizin ismi soyadınızla ne kadar uyumlu? 7 farklı kriter üzerinden fonetik uyum analizi yapın. Hece uyumu, ritim ve ses akışı analizi.",
  openGraph: {
    title: "Soyadı Uyum Analizi — İsim ve Soyadı Uyumu Testi",
    description: "İsim ve soyadı uyumunu 7 farklı kriter üzerinden fonetik olarak analiz edin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={toolPageJsonLd({
        name: "Soyadı Uyum Analizi",
        description: "Bebek ismi ve soyadı arasındaki fonetik uyumu 7 kriter üzerinden analiz eden ücretsiz araç.",
        url: "https://www.isimsec.com/soyad-uyumu",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "Soyadı Uyum Analizi", url: "https://www.isimsec.com/soyad-uyumu" },
      ])} />
      <JsonLd data={faqPageJsonLd([
        { question: "Soyadı uyum analizi nasıl çalışır?", answer: "İsim ve soyadı arasındaki fonetik uyumu 7 kriter üzerinden değerlendirir: hece uyumu, harf geçişi, sesli harf dengesi, ritim analizi, harf tekrarı, fonetik akış ve toplam uzunluk. 100 üzerinden skor üretir." },
        { question: "Soyadı uyum analizi ücretsiz mi?", answer: "Evet, tamamen ücretsizdir. Verileriniz sunucuya gönderilmez, analiz tarayıcınızda gerçekleşir." },
      ])} />
      {children}
    </>
  );
}
