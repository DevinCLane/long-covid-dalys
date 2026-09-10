/** Keep intervention colors consistent across filters and chart metrics. */
export function getScenarioColor(scenarioId: string): string {
  if (scenarioId.startsWith("hepa_")) return "var(--chart-2)";
  if (scenarioId.startsWith("far_uvc_")) return "var(--chart-3)";
  if (scenarioId.endsWith("prophylaxis")) return "var(--tableau-2)";
  if (scenarioId.startsWith("long_covid_")) return "var(--chart-4)";
  return "var(--tableau-4)";
}

/** Colors for health outcomes in breakdown charts. */
export const outcomeColors = {
  acute_covid: "var(--tableau-6)",
  long_covid: "var(--chart-2)",
  pasc: "var(--chart-3)",
  total: "var(--chart-4)",
} as const;
