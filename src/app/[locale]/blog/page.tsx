import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="py-28">
          <BookOpen className="h-12 w-12 text-ocean-300 mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl">{tNav("blog")}</h1>
          <p className="mt-4 text-slate-500 text-lg">
            {tHome("latestArticles")} — Yakında burada olacak.
          </p>
        </div>
      </div>
    </main>
  );
}
