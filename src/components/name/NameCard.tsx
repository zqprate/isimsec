"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { NameEntry } from "@/lib/names";
import { useFavoriteStore } from "@/stores/favoriteStore";

interface NameCardProps {
  name: NameEntry;
  locale: string;
}

const genderColors = {
  male: "badge-gender-male",
  female: "badge-gender-female",
  unisex: "badge-gender-unisex",
};

const genderLabels: Record<string, Record<string, string>> = {
  male: { tr: "Erkek", en: "Boy", de: "Junge", ar: "ولد" },
  female: { tr: "Kız", en: "Girl", de: "Mädchen", ar: "بنت" },
  unisex: { tr: "Unisex", en: "Unisex", de: "Unisex", ar: "للجنسين" },
};

export function NameCard({ name, locale }: NameCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const fav = isFavorite(name.slug);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="clay-interactive p-5 sm:p-6 group relative"
    >
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          fav ? removeFavorite(name.slug) : addFavorite(name.slug);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/60 transition-colors z-10"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-4.5 w-4.5 transition-colors ${
            fav
              ? "fill-coral-400 text-coral-400"
              : "text-slate-300 group-hover:text-slate-400"
          }`}
        />
      </button>

      <Link href={{ pathname: "/isimler/[slug]" as const, params: { slug: name.slug } }} className="block">
        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-display font-bold text-ocean-900 group-hover:text-ocean-700 transition-colors">
          {name.name}
        </h3>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-pill ${
              genderColors[name.gender]
            }`}
          >
            {genderLabels[name.gender]?.[locale] ?? name.gender}
          </span>
          {name.origins.slice(0, 2).map((origin) => (
            <span
              key={origin}
              className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-pill bg-ocean-50 text-ocean-600 border border-ocean-100"
            >
              {origin}
            </span>
          ))}
        </div>

        {/* Meaning */}
        <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
          {name.translation.meaning}
        </p>
      </Link>
    </motion.div>
  );
}
