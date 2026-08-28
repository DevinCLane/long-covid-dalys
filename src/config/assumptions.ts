import reductionFactors from "../data/intervention-reduction-factors.json";

interface Assumption {
  key: string;
  group: keyof typeof GROUP_LABELS;
  sliderLabel: string;
  sliderSubLabel: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  defaultValue: number;
  reductionFactor?: number;
}

/**
 * List of interventions to display. Add or remove interventions here.
 */
export const ASSUMPTIONS: Assumption[] = [
  {
    key: "annualCovidInfectionRate",
    // the "group" is the label that organizes multiple interventions of a similar category
    group: "initialStates",
    sliderLabel: "Annual COVID infection rate",
    sliderSubLabel: "Percent of people who contract COVID each year",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: 28.74,
  },
  {
    key: "longCovidRate",
    // the "group" is the label that organizes multiple interventions of a similar category
    group: "initialStates",
    sliderLabel: "Rate of developing Long COVID",
    sliderSubLabel:
      "Percent of people who develop Long COVID after having acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 2.5,
  },
  {
    key: "disabilityWeightLongCovidMild",
    group: "initialStates",
    sliderLabel: "Disability weight for Long COVID with activity limitations",
    sliderSubLabel:
      "Disability weights indicate an estimate of the fraction of functionality lost to the health condition (e.g., 0.1 is equivalent to 10% of full health lost)",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
    defaultValue: 0.1,
  },
  {
    key: "disabilityWeightLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Disability weight for Long COVID with significant activity limitations",
    sliderSubLabel:
      "Fraction of functionality lost due to having significant activity limitations due to Long COVID",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
    defaultValue: 0.4,
  },
  {
    key: "acuteCovidDisabilityWeight",
    group: "initialStates",
    sliderLabel: "Acute COVID disability weight",
    sliderSubLabel:
      "Disability weight of an acute COVID infection, accounting for the short portion of the year that most people are affected.",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.001,
    defaultValue: 0.015493,
  },
  {
    key: "otherSequelaeDisabilityWeight",
    group: "initialStates",
    sliderLabel:
      "Disability weight of other post-acute sequelae of COVID-19 infection",
    sliderSubLabel:
      "Weighted average disability weight of all other post-acute sequelae of COVID-19 infection",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.001,
    defaultValue: 0.1052,
  },
  {
    key: "riskDeathLongCovidMild",
    group: "initialStates",
    sliderLabel: "Risk of death from Long COVID with activity limitations",
    sliderSubLabel:
      "Proportional annual increased risk of death due to having Long COVID with activity limitations (hazard ratios can technically range from 1 (does not cause incremental risk of death) to infinity; 50 is the hazard ratio for dying from a heart attack)",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.001,
    defaultValue: 1.001,
  },
  {
    key: "riskDeathLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Risk of death from Long COVID with significant activity limitations relative to background mortality",
    sliderSubLabel:
      "Proportional annual increased risk of death due to having Long COVID with significant activity limitations",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.001,
    defaultValue: 1.005,
  },
  {
    key: "riskDeathAcuteCovid",
    group: "initialStates",
    sliderLabel:
      "Risk of death from acute COVID relative to background mortality ",
    sliderSubLabel:
      "Proportional increased risk of death due to having an acute (omicron-era) COVID infection relative to background mortality",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.001,
    defaultValue: 1.005,
  },
  {
    key: "riskDeathLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Risk of death from other post-acute sequelae of COVID relative to background mortality ",
    sliderSubLabel:
      "Weighted average proportional risk of death due to other post-acute sequelae of COVID relative to background mortality.",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.001,
    defaultValue: 1.005,
  },
  {
    key: "rateLongCovidRecovery",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID recovery",
    sliderSubLabel: "Annual rate of full recovery from Long COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 1,
    defaultValue: 10,
  },
  {
    key: "rateLongCovidProgression",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID progression",
    sliderSubLabel:
      "Annual rate of progression from Long COVID with activity limitations to Long COVID with significant activity limitations",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 1,
    defaultValue: 10,
  },
  {
    key: "rateLongCovidImprovement",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID improvement",
    sliderSubLabel:
      "Annual rate of progression from Long COVID with significant activity limitations to Long COVID with activity limitations",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 1,
    defaultValue: 10,
  },
  {
    key: "initialLongCovidMild",
    group: "initialStates",
    sliderLabel: "Initial population with Long COVID with activity limitations",
    sliderSubLabel:
      "The proportion of people living with activity limitations due to Long COVID before the proposed intervention begins",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 3.1,
  },
  {
    key: "initialLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Initial population with Long COVID with significant activity limitations",
    sliderSubLabel:
      "The proportion of people living with significant activity limitations due to Long COVID before the proposed intervention begins",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 1.3,
  },
  {
    key: "hepa",
    group: "interventionParameters",
    sliderLabel: "HEPA filtration",
    sliderSubLabel:
      "Percent of COVID-19 cases avoided by utilizing HEPA filters. The following scenarios would result in the following percents reduction: most common spaces indoor air - 8.0%, schools and daycares - 16.4%, all public indoor air 61.7%",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 61.7,
  },
  {
    key: "uvc",
    group: "interventionParameters",
    sliderLabel: "Far UVC irradiation",
    sliderSubLabel:
      "Percent of COVID-19 cases avoided by utilizing far UVC. The following scenarios would result in the following percents reduction: most common spaces indoor air - 12.0%, schools and daycares - 21.3%, all public indoor air 80.8%",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 80.8,
  },
  {
    key: "preexposureProphylaxis",
    group: "interventionParameters",
    sliderLabel: "Pre-exposure prophylaxis case reduction",
    sliderSubLabel:
      "Percent of cases avoided by utilizing pre-exposure prophylaxis",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 70,
  },
  {
    key: "postexposureProphylaxis",
    group: "interventionParameters",
    sliderLabel: "Post-exposure prophylaxis case reduction",
    sliderSubLabel:
      "Percent of cases avoided by utilizing post-exposure prophylaxis",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 12.38,
  },
  {
    key: "interventionDecreaseProgression",
    group: "interventionParameters",
    sliderLabel:
      "Hypothetical intervention that decreases progression of Long COVID",
    sliderSubLabel:
      "Percent of Long COVID cases that would be prevented from worsening from “activity limitations” to “significant activity limitations”",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 10,
  },
  {
    key: "interventionDecreaseSymptoms",
    group: "interventionParameters",
    sliderLabel:
      "Hypothetical intervention that decreases symptom burden of Long COVID",
    sliderSubLabel:
      "Percent of Long COVID disability that would be removed based on interventions that decrease symptom burden.",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 10,
  },
];

/**
 * Takes in a number of DALYs and reduces them by the
 * amount of an intervention multiplied by its reduction factor
 *
 * @param sliderValue  - the value of the slider in the UI
 * @param sliderMax - the max value of the slider
 * @param reductionFactor - the factor by which the intervention reduces DALYs
 * @returns - the reduced DALYs
 */
export const baseReductionFn = (
  sliderValue: number,
  sliderMax: number,
  reductionFactor: number,
) => {
  return (sliderValue / sliderMax) * reductionFactor;
};

/**
 * Defines categories into which multiple interventions are grouped.
 */
export const GROUP_LABELS: Record<string, string> = {
  initialStates: "Base Parameters",
  interventionParameters: "Intervention Parameters",
};

/**
 * Groups interventions by their category for display purposes.
 */
export const groupedInterventions = ASSUMPTIONS.reduce(
  (acc, intervention) => {
    if (!acc[intervention.group]) acc[intervention.group] = [];
    acc[intervention.group].push(intervention);
    return acc;
  },
  {} as Record<string, Assumption[]>,
);

/**
 * Factor by which interventions lower DALYs. For use with intervention-reduction-factors.json
 */
export type InterventionReductionFactors = Record<string, number>;
