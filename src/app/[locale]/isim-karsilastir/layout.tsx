import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İsim Karşılaştır — İki İsmi Yan Yana Karşılaştırın | İsimSeç",
  description:
    "İki ismi anlam, köken, popülerlik ve hece sayısına göre yan yana karşılaştırın. İsim seçiminizde size yardımcı olacak karşılaştırma aracı.",
  openGraph: {
    title: "İsim Karşılaştır — İki İsmi Yan Yana Karşılaştırın",
    description:
      "İki ismi anlam, köken, popülerlik ve hece sayısına göre karşılaştırın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
