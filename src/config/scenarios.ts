import chartData from "@/data/datav2.json";

export interface Scenario {
  id: string;
  dalys: number;
  infected: number;
  group: string;
  groupLabel?: string;
  label: string;
  sublabel?: string;
  checked: boolean;
}

const LONG_COVID = "long_covid";

function scenarioGroup(id: string): string {
  if (id === "baseline") return "baseline";
  if (id.startsWith("hepa_")) return "hepa";
  if (id.startsWith("far_uvc_")) return "uvc";
  return "other";
}

/**
 * Each scenario for which we display DALYs.
 * ids must match datav2 scenario ids (and chart row keys).
 */
export const SCENARIOS: Scenario[] = chartData.scenarios.map((scenario) => {
  const longCovid = scenario.conditions.find(
    (c) => c.condition === LONG_COVID,
  )!;

  return {
    id: scenario.id,
    dalys: longCovid.totals.dalys_per_1000,
    infected: Math.round(longCovid.annual_infection_rate * 100),
    group: scenarioGroup(scenario.id),
    label: scenario.label,
    checked: true,
  };
});

export const getDefaultSelectedScenarios = (): Set<string> => {
  return new Set(
    SCENARIOS.filter((scenario) => scenario.checked).map(
      (scenario) => scenario.id,
    ),
  );
};

/**
 * map the single word, lowercase group name to the text to display for the group
 */
export const groupLabels: Record<string, string> = {
  baseline: "Baseline",
  hepa: "HEPA Filters",
  uvc: "Far UVC Light",
};

export const groupedScenarios = SCENARIOS.reduce(
  (acc, scenario) => {
    if (!acc[scenario.group]) acc[scenario.group] = [];
    acc[scenario.group].push(scenario);
    return acc;
  },
  {} as Record<string, Scenario[]>,
);
