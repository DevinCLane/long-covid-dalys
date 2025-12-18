// to do: change this to assumptions, and allow the user to change assumptions
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
  reductionFactor: number;
}

/**
 * List of interventions to display. Add or remove interventions here.
 */
export const ASSUMPTIONS: Assumption[] = [
  {
    key: "timeHorizon",
    group: "timeHorizon",
    sliderLabel: "Time Horizon",
    sliderSubLabel: "Time horizon of the model",
    sliderMin: 1,
    sliderMax: 100,
    sliderStep: 1,
    defaultValue: 10,
    reductionFactor: reductionFactors["nasalSprays"],
  },
  {
    key: "noLongCovid",
    // the "group" is the label that organizes multiple interventions of a similar category
    group: "initialStates",
    sliderLabel: "No Long Covid",
    sliderSubLabel: "Percentage of people without Long Covid",
    sliderMin: 60,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 95.6,
    reductionFactor: reductionFactors["airExchangeRate"],
  },
  {
    key: "sick",
    group: "initialStates",
    sliderLabel: "Sick (limitations, HP)",
    sliderSubLabel:
      "Percentage of people with Long Covid who are sick, with health problems",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 3.1,
    reductionFactor: reductionFactors["UVC"],
  },
  {
    key: "sicker",
    group: "initialStates",
    sliderLabel: "Sicker (significant limitations, HP)",
    sliderSubLabel:
      "Percentage of people with Long Covid who are significantly sick, with health problems",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 1.3,
    reductionFactor: reductionFactors["masksHealthcare"],
  },
  {
    key: "LCOnsetRate",
    group: "LCOnsetRate",
    sliderLabel: "Baseline Long Covid onset rate",
    sliderSubLabel:
      "The rate at which acute covid cases convert into Long Covid",
    sliderMin: 2.5,
    sliderMax: 60,
    sliderStep: 0.1,
    defaultValue: 2.5,
    reductionFactor: reductionFactors["masksGeneral"],
  },
  {
    key: "recoveryRate",
    group: "recoveryRate",
    sliderLabel: "Annual recovery rate for Long Covid",
    sliderSubLabel:
      "The rate at which people with Long Covid recover each year",
    sliderMin: 0,
    sliderMax: 50,
    sliderStep: 0.1,
    defaultValue: 10,
    reductionFactor: reductionFactors["sickLeave"],
  },
  {
    key: "progressionRate",
    group: "progressionRate",
    sliderLabel: "Annual disease progression rate",
    sliderSubLabel:
      "The rate at which people with Long Covid's condition worsens each year",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: 10,
    reductionFactor: reductionFactors["testing"],
  },
  {
    key: "disabilityWeightsSick",
    group: "disabilityWeights",
    sliderLabel: "Disability weights: 'sick'",
    sliderSubLabel: "Disability weights for the 'sick' category of Long Covid",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.1,
    defaultValue: 0.1,
    reductionFactor: reductionFactors["vaccinationCurrent"],
  },
  {
    key: "disabilityWeightsSicker",
    group: "disabilityWeights",
    sliderLabel: "Disability weights: 'sicker'",
    sliderSubLabel:
      "Disability weights for the 'sicker' category of Long Covid",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.1,
    defaultValue: 0.4,
    reductionFactor: reductionFactors["vaccinationImproved"],
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
  air: "Air Quality improvements",
  masking: "Masking",
  vaccination: "Vaccination",
  publicHealth: "Public Health Policies",
  pharma: "Pharmaceutical Interventions",
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
