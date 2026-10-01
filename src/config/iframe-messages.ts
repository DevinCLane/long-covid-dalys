import { ChartMetric } from "@/components/chart-metric-toggle";
import { SCENARIO_IDS, ScenarioId } from "./scenario-daly-calculations";

// Keep the production embed and the local iframe harness on their own origins.
export const PARENT_ORIGIN = import.meta.env?.DEV
  ? "http://127.0.0.1:57391"
  : "https://polybio.org";

export const CHART_TAB_IDS = [
  "air",
  "prophylaxis",
  "longCovidMedication",
  "outcomeBreakdown",
] as const;
export const TAB_IDS = [...CHART_TAB_IDS, "about"] as const;
export const METRICS = ["percent", "dalys"] as const;
export const AIR_INTERVENTION_FILTERS = ["all", "hepa", "uvc"] as const;

export type TabId = (typeof TAB_IDS)[number];
export type ChartTabId = (typeof CHART_TAB_IDS)[number];
export type AirId = (typeof AIR_INTERVENTION_FILTERS)[number];

export function isTabId(value: unknown): value is TabId {
  return TAB_IDS.some((tab) => tab === value);
}

export function isMetric(value: unknown): value is ChartMetric {
  return METRICS.some((metric) => metric === value);
}

export function isAirInterventionFilter(value: unknown): value is AirId {
  return AIR_INTERVENTION_FILTERS.some((filter) => filter === value);
}

export function isScenarioId(value: unknown): value is ScenarioId {
  return SCENARIO_IDS.some((id) => id === value);
}
