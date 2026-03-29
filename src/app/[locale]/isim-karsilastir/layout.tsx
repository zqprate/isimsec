import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İsim Karşılaştır — İki İsmi Yan Yana Karşılaştırın | İsimSeç",
  description: "İki ismi anlam, köken, popülerlik ve hece sayısına göre yan yana karşılaştırın. İsim seçiminizde size yardımcı olacak karşılaştırma aracı.",
  openGraph: {
    title: "İsim Karşılaştır — İki İsmi Yan Yana Karşılaştırın",
    description: "İki ismi anlam, köken ve popülerlik bazında karşılaştırın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={toolPageJsonLd({
        name: "İsim Karşılaştırma Aracı",
        description: "İki bebek ismini anlam, köken, popülerlik ve hece sayısına göre yan yana karşılaştıran ücretsiz araç.",
        url: "https://www.isimsec.com/isim-karsilastir",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "İsim Karşılaştır", url: "https://www.isimsec.com/isim-karsilastir" },
      ])} />
      {children}
    </>
  );
}
