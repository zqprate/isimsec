import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popüler İsimler — En Çok Tercih Edilen İsimler | İsimSeç",
  description:
    "En popüler bebek isimleri sıralaması. Trend isimler, popülerlik grafikleri ve detaylı bilgiler.",
  openGraph: {
    title: "Popüler İsimler — En Çok Tercih Edilen İsimler",
    description:
      "En popüler bebek isimleri sıralaması. Trend isimler ve popülerlik grafikleri.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
