export const PARENT_ORIGIN = "https://polybio.org";

export const TAB_IDS = ["air", "pharmaceuticals", "detailed", "about"] as const;
export const AIR_INTERVENTION_FILTERS = ["all", "hepa", "uvc"] as const;
export type TabId = (typeof TAB_IDS)[number];
export type AirId = (typeof AIR_INTERVENTION_FILTERS)[number];

export function isTabId(value: unknown): value is TabId {
  return TAB_IDS.some((tab) => tab === value);
}

export function isAirInterventionFilter(value: unknown): value is AirId {
  return AIR_INTERVENTION_FILTERS.some((filter) => filter === value);
}
