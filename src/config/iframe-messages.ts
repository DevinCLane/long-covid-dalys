import { SCENARIO_IDS, ScenarioId } from "./scenario-daly-calculations";

export const PARENT_ORIGIN = "https://polybio.org";

export const TAB_IDS = [
  "air",
  "pharmaceuticals",
  "outcomeBreakdown",
  "about",
] as const;
export const AIR_INTERVENTION_FILTERS = ["all", "hepa", "uvc"] as const;
export const PHARMACEUTICAL_INTERVENTION_FILTERS = [
  "all",
  "prophylaxis",
  "longCovidMedication",
] as const;

export type TabId = (typeof TAB_IDS)[number];
export type AirId = (typeof AIR_INTERVENTION_FILTERS)[number];
export type PharmaceuticalId =
  (typeof PHARMACEUTICAL_INTERVENTION_FILTERS)[number];

export function isTabId(value: unknown): value is TabId {
  return TAB_IDS.some((tab) => tab === value);
}

export function isAirInterventionFilter(value: unknown): value is AirId {
  return AIR_INTERVENTION_FILTERS.some((filter) => filter === value);
}

export function isPharmaceuticalInterventionFilter(
  value: unknown,
): value is PharmaceuticalId {
  return PHARMACEUTICAL_INTERVENTION_FILTERS.some((filter) => filter === value);
}

export function isScenarioId(value: unknown): value is ScenarioId {
  return SCENARIO_IDS.some((id) => id === value);
}
