import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Bebek İsmi Rehberleri ve Yazılar | İsimSeç",
  description:
    "Bebek ismi seçerken dikkat edilmesi gerekenler, popüler isim trendleri ve isim rehberleri.",
  openGraph: {
    title: "Blog — Bebek İsmi Rehberleri ve Yazılar",
    description:
      "Bebek ismi seçimi rehberleri, popüler isim trendleri ve isim yazıları.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
