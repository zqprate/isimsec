import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İsim Kombinator — İki İsmi Birleştirerek Yeni İsim Üretin | İsimSeç",
  description:
    "İki ismi birleştirerek benzersiz yeni isimler oluşturun. Hece birleştirme, harf karışımı ve daha fazla yöntemle yaratıcı isim önerileri.",
  openGraph: {
    title: "İsim Kombinator — İki İsmi Birleştirerek Yeni İsim Üretin",
    description:
      "İki ismi birleştirerek benzersiz yeni isimler oluşturun.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
