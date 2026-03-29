"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * İsimSeç Logo — Stylized "İS" monogram with baby name symbolism.
 * Ocean gradient, rounded/soft shapes, premium feel.
 */
export function Logo({ size = 36, className = "", animated = true }: LogoProps) {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.06, rotate: -2 },
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }
    : {};

  return (
    <Wrapper
      className={`inline-flex items-center gap-0 cursor-pointer ${className}`}
      {...(wrapperProps as Record<string, unknown>)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="İsimSeç Logo"
      >
        <defs>
          <linearGradient id="logo-ocean" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B93F5" />
            <stop offset="50%" stopColor="#2574EA" />
            <stop offset="100%" stopColor="#1D5DD7" />
          </linearGradient>
          <linearGradient id="logo-gold" x1="24" y1="0" x2="24" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Background rounded square */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logo-ocean)" />

        {/* Inner glow */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="white" opacity="0.08" />

        {/* İ letter — left */}
        <rect x="11" y="16" width="4.5" height="20" rx="2.25" fill="white" />
        {/* İ dot — gold accent */}
        <circle cx="13.25" cy="11" r="2.8" fill="url(#logo-gold)" />

        {/* S letter — right, fluid curve */}
        <path
          d="M24 16c5 0 8 1.8 8 5s-3.5 4.2-8 4.5c-4.5 0.3-8 1.5-8 4.5s3 5 8 5"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Small star accent — top right */}
        <circle cx="38" cy="10" r="1.5" fill="url(#logo-gold)" opacity="0.7" />
      </svg>
    </Wrapper>
  );
}

/**
 * İsimSeç full logo with wordmark.
 */
export function LogoFull({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Logo size={size} animated={false} />
      <span
        className="text-xl font-display font-extrabold tracking-tight text-ocean-800 leading-none"
      >
        İsim<span className="text-ocean-500">Seç</span>
      </span>
    </div>
  );
}
