import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ebeveyn İsim Uyumu — Anne ve Baba İsmine Göre Öneri | İsimSeç",
  description:
    "Anne ve baba isimlerine göre bebeğiniz için uyumlu isim önerileri alın. Harf, ses ve hece uyumu analiziyle kişiselleştirilmiş öneriler.",
  openGraph: {
    title: "Ebeveyn İsim Uyumu — Anne ve Baba İsmine Göre Öneri",
    description:
      "Anne ve baba isimlerine göre bebeğiniz için uyumlu isim önerileri alın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
