import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kız İsimleri — Kız Bebek İsimleri | İsimSeç",
  description:
    "En güzel kız bebek isimleri. Anlamları, kökenleri ve popülerlik bilgileriyle kız isimleri listesi.",
  openGraph: {
    title: "Kız İsimleri — Kız Bebek İsimleri",
    description:
      "En güzel kız bebek isimleri. Anlamları, kökenleri ve popülerlik bilgileriyle.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
