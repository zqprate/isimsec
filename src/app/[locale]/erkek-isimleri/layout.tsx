import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erkek İsimleri — Erkek Bebek İsimleri | İsimSeç",
  description:
    "En güzel erkek bebek isimleri. Anlamları, kökenleri ve popülerlik bilgileriyle erkek isimleri listesi.",
  openGraph: {
    title: "Erkek İsimleri — Erkek Bebek İsimleri",
    description:
      "En güzel erkek bebek isimleri. Anlamları, kökenleri ve popülerlik bilgileriyle.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
