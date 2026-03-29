/**
 * İsimSeç — Google Analytics 4 Event Tracking
 *
 * Custom events for user behavior analysis.
 * Only fires in production with GA_MEASUREMENT_ID configured.
 */

type GtagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

/** Track a custom GA4 event */
export function trackEvent({ action, category, label, value, ...rest }: GtagEvent) {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ── Predefined events ──────────────────────

/** User searched for a name */
export function trackNameSearch(query: string) {
  trackEvent({
    action: "name_search",
    category: "engagement",
    label: query,
  });
}

/** User viewed a name detail page */
export function trackNameView(name: string, locale: string) {
  trackEvent({
    action: "name_view",
    category: "content",
    label: name,
    locale,
  });
}

/** User added/removed a name from favorites */
export function trackNameFavorite(name: string, added: boolean) {
  trackEvent({
    action: "name_favorite",
    category: "engagement",
    label: name,
    value: added ? 1 : 0,
  });
}

/** User applied a filter */
export function trackFilterUse(filterType: string, filterValue: string) {
  trackEvent({
    action: "filter_use",
    category: "engagement",
    label: `${filterType}:${filterValue}`,
  });
}

/** User used an interactive tool */
export function trackToolUse(
  tool: "name_finder" | "compare" | "surname_harmony" | "combinator" | "parent_match" | "random"
) {
  trackEvent({
    action: "tool_use",
    category: "tools",
    label: tool,
  });
}

/** User switched language */
export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  trackEvent({
    action: "language_switch",
    category: "settings",
    label: `${fromLocale}_to_${toLocale}`,
  });
}

/** Set user properties for GA4 */
export function setUserProperties(properties: Record<string, string | number>) {
  gtag("set", "user_properties", properties);
}
