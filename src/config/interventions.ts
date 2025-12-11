// to do: change this to assumptions, and allow the user to change assumptions
import reductionFactors from "../data/intervention-reduction-factors.json";

interface Intervention {
  key: string;
  group: keyof typeof GROUP_LABELS;
  ariaLabel: string;
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
export const INTERVENTIONS: Intervention[] = [
  {
    key: "airExchangeRate",
    // the "group" is the label that organizes multiple interventions of a similar category
    group: "air",
    ariaLabel: "Air Changes Per Hour (ACH)",
    sliderLabel: "Air changes per hour (ACH)",
    sliderSubLabel: "Percentage of buildings with a minimum of 5 ACH",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["airExchangeRate"],
  },
  {
    key: "UVC",
    group: "air",
    ariaLabel: "Far germicidal UVC",
    sliderLabel: "Far germicidal UVC",
    sliderSubLabel: "Percentage of buildings with far germicidal UVC",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["UVC"],
  },
  {
    key: "masksHealthcare",
    group: "masking",
    ariaLabel: "Masks in Healthcare Settings",
    sliderLabel: "Masking in healthcare facilities",
    sliderSubLabel: "Percentage of healthcare facilities with mask mandates",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["masksHealthcare"],
  },
  {
    key: "masksGeneral",
    group: "masking",
    ariaLabel: "Masks in General Population",
    sliderLabel: "Masking in general population",
    sliderSubLabel: "Percentage of general population wearing masks",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["masksGeneral"],
  },
  {
    key: "sickLeave",
    group: "publicHealth",
    ariaLabel: "Paid Sick Leave",
    sliderLabel: "Paid sick leave",
    sliderSubLabel: "Percentage of workers with paid sick leave",
    sliderMin: 0,
    sliderMax: 52,
    sliderStep: 1,
    defaultValue: 0,
    reductionFactor: reductionFactors["sickLeave"],
  },
  {
    key: "testing",
    group: "publicHealth",
    ariaLabel: "Free COVID Tests",
    sliderLabel: "Free COVID tests",
    sliderSubLabel:
      "Percentage of population with free COVID tests available to them",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["testing"],
  },
  {
    key: "vaccinationCurrent",
    group: "vaccination",
    ariaLabel: "Vaccination Coverage: Current Vaccines",
    sliderLabel: "Vaccination coverage: current vaccines",
    sliderSubLabel:
      "Percentage of population with up-to-date vaccination for current variants",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["vaccinationCurrent"],
  },
  {
    key: "vaccinationImproved",
    group: "vaccination",
    ariaLabel:
      "Vaccination Coverage: Improved Vaccines for Long COVID Prevention",
    sliderLabel:
      "Vaccination coverage: hypothetical improved vaccine for long COVID prevention",
    sliderSubLabel:
      "Percentage of population with hypothetical improved vaccine for long COVID prevention",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["vaccinationImproved"],
  },
  {
    key: "nasalSprays",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Nasal Sprays",
    sliderLabel: "Pharmaceutical intervention: nasal sprays",
    sliderSubLabel:
      "Percentage of population using COVID preventative nasal sprays",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["nasalSprays"],
  },
  {
    key: "paxlovid",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Paxlovid",
    sliderLabel: "Pharmaceutical intervention: Paxlovid",
    sliderSubLabel:
      "Percentage of population taking Paxlovid during acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["paxlovid"],
  },
  {
    key: "metformin",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Metformin",
    sliderLabel: "Pharmaceutical intervention: metformin",
    sliderSubLabel:
      "Percentage of population taking Metformin during acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["metformin"],
  },
  {
    key: "reduceSymptoms",
    group: "pharma",
    ariaLabel:
      "Pharmaceutical Interventions - Reduction of Long COVID Symptoms",
    sliderLabel:
      "Pharmaceutical intervention: reduction of long covid symptoms",
    sliderSubLabel:
      "Percentage of population taking pharmaceuticals that reduce long covid symptoms",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFactor: reductionFactors["reduceSymptoms"],
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
export const groupedInterventions = INTERVENTIONS.reduce(
  (acc, intervention) => {
    if (!acc[intervention.group]) acc[intervention.group] = [];
    acc[intervention.group].push(intervention);
    return acc;
  },
  {} as Record<string, Intervention[]>,
);

/**
 * Factor by which interventions lower DALYs. For use with intervention-reduction-factors.json
 */
export type InterventionReductionFactors = Record<string, number>;
