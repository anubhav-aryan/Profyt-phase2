/**
 * Scale Risk Score: sector benchmarks for growth and capital dimensions.
 * Used for industry comparison in results (toggle on/off).
 */

export const SRS_SECTOR_OPTIONS = [
  "SaaS / B2B Tech",
  "D2C / Consumer",
  "Fintech / BFSI",
  "Healthtech / MedTech",
  "Edtech / Consumer Tech",
  "Marketplace / Platform",
  "Professional Services",
] as const;

export type SrsSectorKey = (typeof SRS_SECTOR_OPTIONS)[number];

export interface SrsSectorBenchmarks {
  growth: number;
  capital: number;
}

export const SECTOR_BENCHMARKS: Record<SrsSectorKey, SrsSectorBenchmarks> = {
  "SaaS / B2B Tech": { growth: 32, capital: 38 },
  "D2C / Consumer": { growth: 42, capital: 44 },
  "Fintech / BFSI": { growth: 28, capital: 30 },
  "Healthtech / MedTech": { growth: 35, capital: 40 },
  "Edtech / Consumer Tech": { growth: 48, capital: 46 },
  "Marketplace / Platform": { growth: 38, capital: 42 },
  "Professional Services": { growth: 24, capital: 28 },
};

const STORAGE_KEY = "profyt-srs-benchmarks-v1";

export interface StoredSrsBenchmarks {
  benchmarks: Record<string, SrsSectorBenchmarks>;
  meta: Record<string, { n: number; basis: string; updated: string }>;
}

/** @deprecated Prefer API-backed benchmarks from /api/benchmarks */
export function getStoredSrsBenchmarks(): StoredSrsBenchmarks | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSrsBenchmarks;
  } catch {
    return null;
  }
}

/** @deprecated Prefer admin-configured benchmarks */
export function setStoredSrsBenchmarks(data: StoredSrsBenchmarks): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Normalizes API response into sector-keyed scale-risk benchmarks.
 * Missing or invalid sectors fall back to SECTOR_BENCHMARKS.
 */
export function srsBenchmarksFromApiPayload(
  scaleRisk: Record<string, unknown> | null | undefined
): Record<SrsSectorKey, SrsSectorBenchmarks> {
  const out = { ...SECTOR_BENCHMARKS } as Record<SrsSectorKey, SrsSectorBenchmarks>;
  if (!scaleRisk || typeof scaleRisk !== "object") return out;
  for (const sector of SRS_SECTOR_OPTIONS) {
    const row = scaleRisk[sector];
    if (row && typeof row === "object" && !Array.isArray(row)) {
      const r = row as Record<string, unknown>;
      if (typeof r.growth === "number" && typeof r.capital === "number") {
        out[sector] = { growth: r.growth, capital: r.capital };
      }
    }
  }
  return out;
}

/**
 * Returns scale-risk benchmark for a sector. Uses apiBenchmarks when provided (e.g. from /api/benchmarks), else built-in defaults.
 */
export function getSrsBenchmarksForSector(
  sector: SrsSectorKey | null,
  apiBenchmarks?: Record<string, SrsSectorBenchmarks> | null
): SrsSectorBenchmarks | null {
  if (!sector) return null;
  if (apiBenchmarks && sector in apiBenchmarks) return apiBenchmarks[sector];
  return SECTOR_BENCHMARKS[sector] ?? null;
}
