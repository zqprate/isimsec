import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolPageJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ebeveyn İsim Uyumu — Anne ve Baba İsmine Göre Öneri | İsimSeç",
  description: "Anne ve baba isimlerine göre bebeğiniz için uyumlu isim önerileri alın. Harf, ses ve hece uyumu analiziyle kişiselleştirilmiş öneriler.",
  openGraph: {
    title: "Ebeveyn İsim Uyumu — Anne ve Baba İsmine Göre Öneri",
    description: "Anne ve baba isimlerine göre uyumlu bebek ismi önerileri.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={toolPageJsonLd({
        name: "Ebeveyn İsim Uyumu",
        description: "Anne ve baba isimlerine göre harf, ses ve hece uyumu analizi yaparak uyumlu bebek ismi öneren ücretsiz araç.",
        url: "https://www.isimsec.com/ebeveyn-uyumu",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "Ebeveyn İsim Uyumu", url: "https://www.isimsec.com/ebeveyn-uyumu" },
      ])} />
      <JsonLd data={faqPageJsonLd([
        { question: "Ebeveyn isim uyumu nasıl çalışır?", answer: "Anne ve baba isimlerindeki harfleri, hece yapısını ve ses uyumunu analiz ederek bebeğiniz için uyumlu isimler önerir." },
        { question: "Bu araç ücretsiz mi?", answer: "Evet, tamamen ücretsiz ve kayıt gerektirmez." },
      ])} />
      {children}
    </>
  );
}
