"use client";

import { useEffect, useRef, useState } from "react";

type AdSize = "leaderboard" | "rectangle" | "sidebar" | "responsive";

const adSizes: Record<AdSize, { width: number; height: number; label: string }> = {
  leaderboard: { width: 728, height: 90, label: "728×90" },
  rectangle: { width: 336, height: 280, label: "336×280" },
  sidebar: { width: 300, height: 250, label: "300×250" },
  responsive: { width: 0, height: 0, label: "Responsive" },
};

interface AdBannerProps {
  slot: string;
  size?: AdSize;
  className?: string;
}

export function AdBanner({ slot, size = "responsive", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isProd = process.env.NODE_ENV === "production";
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Lazy load: only render ad when in viewport
  useEffect(() => {
    if (!adRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Push ad when visible
  useEffect(() => {
    if (!isVisible || !isProd || !clientId) return;
    try {
      ((window as unknown as Record<string, unknown>).adsbygoogle as unknown[] || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, [isVisible, isProd, clientId]);

  const dim = adSizes[size];

  // Development placeholder
  if (!isProd || !clientId) {
    return (
      <div
        ref={adRef}
        className={`flex items-center justify-center border-2 border-dashed border-ocean-200 rounded-card bg-ocean-50/30 text-ocean-400 text-sm font-medium ${className}`}
        style={{
          width: dim.width || "100%",
          height: dim.height || 90,
          maxWidth: "100%",
        }}
      >
        Ad: {dim.label} — slot: {slot}
      </div>
    );
  }

  // Production AdSense
  return (
    <div ref={adRef} className={`overflow-hidden ${className}`}>
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: dim.width || "100%",
            height: dim.height || "auto",
            maxWidth: "100%",
          }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={size === "responsive" ? "auto" : undefined}
          data-full-width-responsive={size === "responsive" ? "true" : undefined}
        />
      )}
    </div>
  );
}
