/**
 * Root layout — minimal pass-through.
 * The actual <html>/<body> rendering happens in [locale]/layout.tsx
 * so that locale-specific attributes (lang, dir) can be set dynamically.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
