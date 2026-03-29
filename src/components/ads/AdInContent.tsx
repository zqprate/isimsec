"use client";

import { AdBanner } from "./AdBanner";

interface AdInContentProps {
  slot: string;
  className?: string;
}

/**
 * In-content ad with visual separator.
 * Placed between content sections with clear separation.
 */
export function AdInContent({ slot, className = "" }: AdInContentProps) {
  return (
    <div
      className={`my-8 py-4 flex justify-center ${className}`}
      aria-label="Advertisement"
      role="complementary"
    >
      <AdBanner slot={slot} size="rectangle" />
    </div>
  );
}
