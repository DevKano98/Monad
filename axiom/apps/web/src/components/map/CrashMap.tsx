import { useMemo } from "react";

import WorldMap from "@/components/ui/world-map";

import type { CrashMapPoint } from "../../types";
import { useAppStore } from "../../stores/app.store";

const REGION_FALLBACKS: Record<string, { lat: number; lng: number }> = {
  "us-east": { lat: 39, lng: -77 },
  "us-west": { lat: 37.3, lng: -122 },
  "us-central": { lat: 41.8, lng: -88 },
  "eu-west": { lat: 53, lng: -8 },
  "eu-central": { lat: 50.1, lng: 10.2 },
  "ap-southeast": { lat: 1.35, lng: 103.82 },
  "ap-south": { lat: 19, lng: 72.8 },
  "ap-northeast": { lat: 35.7, lng: 139.7 },
  "sa-east": { lat: -23.5, lng: -46.6 },
  "af-south": { lat: -33.9, lng: 18.4 },
  "me-central": { lat: 25.2, lng: 55.3 },
  unknown: { lat: 20, lng: 0 },
  "unknown-region": { lat: 20, lng: 0 },
};

const LINE_COLORS: Record<CrashMapPoint["severity"], string> = {
  critical: "#fb7185",
  high: "#f59e0b",
  medium: "#34d399",
  low: "#38bdf8",
};

const MAP_ANCHOR = { lat: 20, lng: 0 };

export function CrashMap({ points, compact = false }: { points: CrashMapPoint[]; compact?: boolean }) {
  const darkMode = useAppStore((state) => state.darkMode);

  const dots = useMemo(
    () =>
      points
        .map((point) => {
          const end = resolvePoint(point);
          if (!end) {
            return null;
          }
          return {
            start: MAP_ANCHOR,
            end,
          };
        })
        .filter((dot): dot is { start: { lat: number; lng: number }; end: { lat: number; lng: number } } => dot !== null),
    [points],
  );

  const lineColor = useMemo(() => {
    if (points.length === 0) {
      return darkMode ? "#7dd3fc" : "#0ea5e9";
    }
    const severityOrder: CrashMapPoint["severity"][] = ["critical", "high", "medium", "low"];
    const worst = points.reduce<CrashMapPoint["severity"]>((current, point) => {
      return severityOrder.indexOf(point.severity) < severityOrder.indexOf(current) ? point.severity : current;
    }, points[0].severity);
    return LINE_COLORS[worst];
  }, [darkMode, points]);

  return (
    <div className={compact ? "overflow-hidden rounded-[28px]" : "grid gap-4 lg:grid-cols-[1fr_280px]"}>
      <WorldMap dots={dots} lineColor={lineColor} theme={darkMode ? "dark" : "light"} />
      {!compact ? (
        <aside className="rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Approximate locations</div>
          <div className="mt-4 grid gap-3">
            {points.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800">
                Waiting for the first ingest event.
              </div>
            ) : (
              points.slice(0, 5).map((point) => {
                const resolved = resolvePoint(point);
                return (
                  <div key={point.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{point.error_type}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {point.region} {point.country ? `· ${point.country}` : ""}
                        </div>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                        style={{ color: LINE_COLORS[point.severity], backgroundColor: `${LINE_COLORS[point.severity]}18` }}
                      >
                        {point.severity}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <div className="uppercase tracking-[0.22em] text-slate-400">Matches</div>
                        <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">{point.match_count}</div>
                      </div>
                      <div>
                        <div className="uppercase tracking-[0.22em] text-slate-400">Fixes</div>
                        <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">{point.known_fix_count}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs leading-5 text-slate-500">
                      {formatLocation(resolved)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function resolvePoint(point: CrashMapPoint) {
  if (point.latitude != null && point.longitude != null) {
    return { lat: point.latitude, lng: point.longitude };
  }

  const normalizedRegion = point.region.toLowerCase().replace(/\s+/g, "-");
  if (normalizedRegion in REGION_FALLBACKS) {
    return REGION_FALLBACKS[normalizedRegion];
  }

  if (point.country) {
    const country = point.country.toLowerCase();
    if (country === "us") return REGION_FALLBACKS["us-east"];
    if (country === "ca") return { lat: 45.4, lng: -73.6 };
    if (country === "gb") return REGION_FALLBACKS["eu-west"];
    if (country === "de") return REGION_FALLBACKS["eu-central"];
    if (country === "sg") return REGION_FALLBACKS["ap-southeast"];
    if (country === "in") return REGION_FALLBACKS["ap-south"];
    if (country === "jp") return REGION_FALLBACKS["ap-northeast"];
  }

  return hashCoordinates(point.fingerprint_hash);
}

function hashCoordinates(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  const lat = ((hash % 14000) / 100) - 70;
  const lng = (((hash >> 3) % 36000) / 100) - 180;
  return { lat, lng };
}

function formatLocation(location: { lat: number; lng: number } | null) {
  if (!location) {
    return "Using region fallback";
  }

  return `Lat ${location.lat.toFixed(2)}, Lng ${location.lng.toFixed(2)}`;
}
