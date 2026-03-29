import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda — İsimSeç Hakkında | İsimSeç",
  description:
    "İsimSeç, 13.000+ isim veritabanı ve 4 dil desteğiyle bebek ismi keşif platformudur. Misyonumuz, veri kaynakları ve ekip bilgileri.",
  openGraph: {
    title: "Hakkımızda — İsimSeç Hakkında",
    description:
      "İsimSeç, 13.000+ isim veritabanı ve 4 dil desteğiyle bebek ismi keşif platformu.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
