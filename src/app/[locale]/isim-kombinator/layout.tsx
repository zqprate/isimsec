import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İsim Kombinator — İki İsmi Birleştirerek Yeni İsim Üretin | İsimSeç",
  description: "İki ismi birleştirerek benzersiz yeni isimler oluşturun. Hece birleştirme, harf karışımı ve daha fazla yöntemle yaratıcı isim önerileri.",
  openGraph: {
    title: "İsim Kombinator — İki İsmi Birleştirerek Yeni İsim Üretin",
    description: "İki ismi birleştirerek benzersiz yeni isimler oluşturun.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={toolPageJsonLd({
        name: "İsim Kombinator",
        description: "İki ismi hece ve harf birleştirme yöntemleriyle birleştirerek yeni benzersiz isimler üreten ücretsiz araç.",
        url: "https://www.isimsec.com/isim-kombinator",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: "https://www.isimsec.com" },
        { name: "İsim Kombinator", url: "https://www.isimsec.com/isim-kombinator" },
      ])} />
      {children}
    </>
  );
}
