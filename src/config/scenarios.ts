export interface Scenario {
  key: string;
  label: string;
  description: string;
  reductionFactor: number; // Percentage reduction from baseline (0-1)
  dalysPer1000: number; // DALYs per 1,000 people over 10 years
}

/**
 * Scenarios based on air cleaning interventions in different settings.
 * DALY values are per 1,000 people over 10 years.
 * Reduction factors are calculated as: (baseline - scenario) / baseline
 */
export const SCENARIOS: Scenario[] = [
  {
    key: "baseline",
    label: "Baseline",
    description:
      "No air cleaning intervention. ~29% of population infected annually.",
    reductionFactor: 0,
    dalysPer1000: 258,
  },
  {
    key: "hepa-schools",
    label: "HEPA schools and daycares",
    description:
      "HEPA filters implemented in all K-12 schools, preschools, and daycare settings.",
    reductionFactor: 0.0969, // (258 - 233) / 258
    dalysPer1000: 233,
  },
  {
    key: "far-uvc-schools",
    label: "Far UVC schools and daycares",
    description:
      "Far germicidal UV-C implemented in all K-12 schools, preschools, and daycare settings.",
    reductionFactor: 0.124, // (258 - 226) / 258
    dalysPer1000: 226,
  },
  {
    key: "hepa-all-public",
    label: "HEPA all public indoor air",
    description: "HEPA filters implemented in all public indoor settings.",
    reductionFactor: 0.372, // (258 - 162) / 258
    dalysPer1000: 162,
  },
  {
    key: "far-uvc-all-public",
    label: "Far UVC all public indoor air",
    description:
      "Far germicidal UV-C implemented in all public indoor settings.",
    reductionFactor: 0.492, // (258 - 131) / 258
    dalysPer1000: 131,
  },
];

/**
 * Get a scenario by its key
 */
export const getScenarioByKey = (key: string): Scenario | undefined => {
  return SCENARIOS.find((scenario) => scenario.key === key);
};

/**
 * Get the default scenario (baseline)
 */
export const getDefaultScenario = (): Scenario => {
  return SCENARIOS[0];
};
