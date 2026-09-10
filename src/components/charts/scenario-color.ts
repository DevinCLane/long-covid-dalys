/** Keep intervention colors consistent across filters and chart metrics. */
export function getScenarioColor(scenarioId: string): string {
  if (scenarioId.startsWith("hepa_")) return "var(--chart-2)";
  if (scenarioId.startsWith("far_uvc_")) return "var(--chart-3)";
  if (scenarioId.endsWith("prophylaxis")) return "var(--chart-5)";
  if (scenarioId.startsWith("long_covid_")) return "var(--chart-4)";
  return "var(--muted-foreground)";
}
