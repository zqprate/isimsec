import Script from "next/script";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Google AdSense global script.
 * Only loads in production with a valid client ID.
 * Include once in the root layout.
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
