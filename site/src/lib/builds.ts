import { getCollection, type CollectionEntry } from 'astro:content';

export type Build = CollectionEntry<'builds'>;

const publishedTime = (b: Build) => b.data.published?.getTime() ?? 0;

/**
 * Live builds, newest first. Drafts are hidden in production only, so a
 * work-in-progress entry is still visible with `astro dev`.
 */
export async function getPublishedBuilds(): Promise<Build[]> {
  const all = await getCollection('builds', ({ data }) =>
    import.meta.env.PROD ? data.status !== 'draft' : true,
  );
  return all.sort((a, b) => publishedTime(b) - publishedTime(a));
}

/**
 * The home hero: an explicit `featured: true` wins; else the most recent build
 * that runs on this site (the strongest dogfooding proof); else the newest.
 */
export function pickFeatured(builds: Build[]): Build | undefined {
  return (
    builds.find((b) => b.data.featured) ??
    builds.find((b) => b.data.runs_on_site) ??
    builds[0]
  );
}

export interface MonthGroup {
  key: string;
  label: string;
  items: Build[];
}

/** Buckets builds by publish month, preserving the newest-first input order. */
export function groupByMonth(builds: Build[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const b of builds) {
    const d = b.data.published;
    const key = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : 'undated';
    const label = d ? monthYear(d) : 'Undated';
    if (!groups.has(key)) groups.set(key, { key, label, items: [] });
    groups.get(key)!.items.push(b);
  }
  return [...groups.values()];
}

/**
 * The categories that actually have a published build. The archive filter chips
 * are built from THIS — never a hardcoded list — so there are no thin category
 * pages (CONTEXT.md §15). Order follows the canonical taxonomy.
 */
const TAXONOMY_ORDER = [
  'chatbots', 'video', 'websites', 'automation',
  'writing', 'research', 'design', 'agents',
] as const;

export function activeCategories(builds: Build[]): string[] {
  const present = new Set(builds.map((b) => b.data.category));
  return TAXONOMY_ORDER.filter((c) => present.has(c));
}

export interface ToolView {
  name: string;
  buildCount: number;
  category: Build['data']['category'];
  runs_on_site: boolean;
  summary?: string; // tool_summary
  verdict?: string; // tool_verdict
  accessibility?: string;
  affiliate_url?: string;
  primary: Build; // the build "See the build ->" links to
}

/**
 * The /tools index, DERIVED from the builds collection — not a second source of
 * truth about tools. One tool may eventually have several builds; when it does,
 * this uses the MOST-RECENT build's tool_* fields for the displayed
 * verdict/summary/accessibility and sums the build count.
 *
 * "Most-recent wins" is a deliberate, documented choice: a newer build reflects
 * the tool's current state (pricing, limits) better than an older one. It lives
 * here so a future reader never has to reverse-engineer the rule.
 */
export function toolsFromBuilds(builds: Build[]): ToolView[] {
  const byTool = new Map<string, Build[]>();
  for (const b of builds) {
    const key = b.data.tool;
    if (!byTool.has(key)) byTool.set(key, []);
    byTool.get(key)!.push(b);
  }

  const views: ToolView[] = [];
  for (const [name, list] of byTool) {
    const recent = [...list].sort((a, b) => publishedTime(b) - publishedTime(a));
    const primary = recent[0]; // most-recent wins
    views.push({
      name,
      buildCount: list.length,
      category: primary.data.category,
      runs_on_site: list.some((b) => b.data.runs_on_site),
      summary: primary.data.tool_summary,
      verdict: primary.data.tool_verdict,
      accessibility: primary.data.accessibility,
      affiliate_url: primary.data.affiliate_url,
      primary,
    });
  }
  // Freshest tool first (by its most-recent build).
  return views.sort((a, b) => publishedTime(b.primary) - publishedTime(a.primary));
}

// ---- date formatting ---------------------------------------------------------
// Archive month headers read "July 2026"; inline stamps read lowercase "jul 2026".
export const monthYear = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const monShort = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase();
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
