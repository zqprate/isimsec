import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim — Bize Ulaşın | İsimSeç",
  description:
    "Soru, öneri veya geri bildirimleriniz için bizimle iletişime geçin.",
  openGraph: {
    title: "İletişim — Bize Ulaşın",
    description:
      "Soru, öneri veya geri bildirimleriniz için bizimle iletişime geçin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
