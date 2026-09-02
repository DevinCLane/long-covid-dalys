import {
  AIR_CLEANING_SCENARIOS,
  BASELINE_INFECTION_PROPORTION,
  DEFAULT_ACUTE_COVID_PARAMETERS,
  DEFAULT_LONG_COVID_DISABILITY_REDUCTION,
  DEFAULT_LONG_COVID_PARAMETERS,
  DEFAULT_LONG_COVID_PROGRESSION_REDUCTION,
  DEFAULT_PASC_PARAMETERS,
  DEFAULT_POSTEXPOSURE_PROPHYLAXIS_MAXIMUM_REDUCTION,
  DEFAULT_PREEXPOSURE_PROPHYLAXIS_EFFICACY,
} from "@/config/daly-model";

export const GROUP_LABELS = {
  initialStates: "Base Parameters",
  interventionParameters: "Intervention Parameters",
} as const;

interface AssumptionDefinition {
  key: string;
  group: keyof typeof GROUP_LABELS;
  sliderLabel: string;
  sliderSubLabel: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  defaultValue: number;
}

function toPercent(proportion: number) {
  return proportion * 100;
}

function airCleaningReductionPercent(
  scenarioId: keyof typeof AIR_CLEANING_SCENARIOS,
) {
  return toPercent(
    1 -
      AIR_CLEANING_SCENARIOS[scenarioId].annualInfectionProportion /
        BASELINE_INFECTION_PROPORTION,
  );
}

/**
 * UI copy remains intentionally explicit here. Numerical defaults come from
 * daly-model.ts so a default slider run always reproduces the model.
 */
export const ASSUMPTIONS = [
  {
    key: "annualCovidInfectionRate",
    group: "initialStates",
    sliderLabel: "Annual COVID infection rate",
    sliderSubLabel: "Percent of people who contract COVID each year",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: toPercent(BASELINE_INFECTION_PROPORTION),
  },
  {
    key: "longCovidRate",
    group: "initialStates",
    sliderLabel: "Rate of developing Long COVID",
    sliderSubLabel:
      "Percent of people who develop Long COVID after having acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: toPercent(
      DEFAULT_LONG_COVID_PARAMETERS.onsetRiskPerInfection,
    ),
  },
  {
    key: "disabilityWeightLongCovidMild",
    group: "initialStates",
    sliderLabel: "Disability weight for Long COVID with activity limitations",
    sliderSubLabel:
      "Disability weights estimate the fraction of full health lost to a condition.",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
    defaultValue: DEFAULT_LONG_COVID_PARAMETERS.disabilityWeightS1,
  },
  {
    key: "disabilityWeightLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Disability weight for Long COVID with significant activity limitations",
    sliderSubLabel:
      "Fraction of full health lost due to significant activity limitations from Long COVID",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
    defaultValue: DEFAULT_LONG_COVID_PARAMETERS.disabilityWeightS2,
  },
  {
    key: "acuteCovidDisabilityWeight",
    group: "initialStates",
    sliderLabel: "Acute COVID duration-weighted disability",
    sliderSubLabel:
      "Acute COVID disability weight adjusted for the portion of a year that an infection lasts.",
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.000001,
    defaultValue: DEFAULT_ACUTE_COVID_PARAMETERS.durationWeightedDisability,
  },
  {
    key: "otherSequelaeDisabilityWeight",
    group: "initialStates",
    sliderLabel: "PASC disability-weight multiplier",
    sliderSubLabel:
      "Multiplier applied to the evidence-reviewed disability weights for all six PASC components",
    sliderMin: 0,
    sliderMax: 2,
    sliderStep: 0.01,
    defaultValue: DEFAULT_PASC_PARAMETERS.disabilityWeightMultiplier,
  },
  {
    key: "riskDeathLongCovidMild",
    group: "initialStates",
    sliderLabel:
      "Mortality hazard ratio for Long COVID with activity limitations",
    sliderSubLabel:
      "Annual mortality hazard relative to background mortality for Long COVID with activity limitations",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.0001,
    defaultValue: DEFAULT_LONG_COVID_PARAMETERS.mortalityHazardRatioS1,
  },
  {
    key: "riskDeathLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Mortality hazard ratio for Long COVID with significant activity limitations",
    sliderSubLabel:
      "Annual mortality hazard relative to background mortality for Long COVID with significant activity limitations",
    sliderMin: 1,
    sliderMax: 50,
    sliderStep: 0.0001,
    defaultValue: DEFAULT_LONG_COVID_PARAMETERS.mortalityHazardRatioS2,
  },
  {
    key: "riskDeathAcuteCovid",
    group: "initialStates",
    sliderLabel: "Acute COVID mortality multiplier",
    sliderSubLabel:
      "Multiplier applied to the model's age-weighted acute COVID infection fatality risk",
    sliderMin: 0,
    sliderMax: 5,
    sliderStep: 0.01,
    defaultValue: DEFAULT_ACUTE_COVID_PARAMETERS.mortalityMultiplier,
  },
  {
    key: "riskDeathPasc",
    group: "initialStates",
    sliderLabel: "PASC excess-mortality multiplier",
    sliderSubLabel:
      "Multiplier applied to disease-attributable mortality in the six PASC component models",
    sliderMin: 0,
    sliderMax: 5,
    sliderStep: 0.01,
    defaultValue: DEFAULT_PASC_PARAMETERS.mortalityMultiplier,
  },
  {
    key: "rateLongCovidRecovery",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID recovery",
    sliderSubLabel: "Annual rate of full recovery from Long COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PARAMETERS.recoveryRate),
  },
  {
    key: "rateLongCovidProgression",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID progression",
    sliderSubLabel:
      "Annual rate of progression from activity limitations to significant activity limitations",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PARAMETERS.progressionRate),
  },
  {
    key: "rateLongCovidImprovement",
    group: "initialStates",
    sliderLabel: "Rate of Long COVID improvement",
    sliderSubLabel:
      "Annual rate of improvement from significant activity limitations to activity limitations",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PARAMETERS.improvementRate),
  },
  {
    key: "initialLongCovidMild",
    group: "initialStates",
    sliderLabel: "Initial population with Long COVID with activity limitations",
    sliderSubLabel:
      "Percent of the population with activity limitations from Long COVID at the start",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PARAMETERS.initialState.S1),
  },
  {
    key: "initialLongCovidSignificant",
    group: "initialStates",
    sliderLabel:
      "Initial population with Long COVID with significant activity limitations",
    sliderSubLabel:
      "Percent of the population with significant activity limitations from Long COVID at the start",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PARAMETERS.initialState.S2),
  },
  {
    key: "hepa",
    group: "interventionParameters",
    sliderLabel: "HEPA filtration maximum case reduction",
    sliderSubLabel:
      "Maximum percent of infections avoided by full HEPA implementation; other HEPA scenarios retain their evidence-based relative intensity",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: airCleaningReductionPercent("hepa_all_public"),
  },
  {
    key: "uvc",
    group: "interventionParameters",
    sliderLabel: "Far-UVC maximum case reduction",
    sliderSubLabel:
      "Maximum percent of infections avoided by full Far-UVC implementation; other Far-UVC scenarios retain their evidence-based relative intensity",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: airCleaningReductionPercent("far_uvc_all_public"),
  },
  {
    key: "preexposureProphylaxis",
    group: "interventionParameters",
    sliderLabel: "Pre-exposure prophylaxis efficacy",
    sliderSubLabel:
      "Relative reduction in infection at full adoption of pre-exposure prophylaxis",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: toPercent(DEFAULT_PREEXPOSURE_PROPHYLAXIS_EFFICACY),
  },
  {
    key: "postexposureProphylaxis",
    group: "interventionParameters",
    sliderLabel: "Post-exposure prophylaxis maximum case reduction",
    sliderSubLabel:
      "Maximum population infection reduction at full implementation of post-exposure prophylaxis",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.01,
    defaultValue: toPercent(DEFAULT_POSTEXPOSURE_PROPHYLAXIS_MAXIMUM_REDUCTION),
  },
  {
    key: "interventionDecreaseProgression",
    group: "interventionParameters",
    sliderLabel: "Long COVID progression reduction",
    sliderSubLabel:
      "Percent reduction in progression from activity limitations to significant activity limitations",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_PROGRESSION_REDUCTION),
  },
  {
    key: "interventionDecreaseSymptoms",
    group: "interventionParameters",
    sliderLabel: "Long COVID symptom-burden reduction",
    sliderSubLabel:
      "Percent reduction applied to both Long COVID disability weights in the treatment scenario",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 0.1,
    defaultValue: toPercent(DEFAULT_LONG_COVID_DISABILITY_REDUCTION),
  },
] as const satisfies readonly AssumptionDefinition[];

export type Assumption = (typeof ASSUMPTIONS)[number];
export type AssumptionKey = Assumption["key"];
export type AssumptionValues = { [Key in AssumptionKey]: number };

export const ASSUMPTIONS_BY_KEY = Object.fromEntries(
  ASSUMPTIONS.map((assumption) => [assumption.key, assumption]),
) as { [Key in AssumptionKey]: Extract<Assumption, { key: Key }> };

export const DEFAULT_ASSUMPTION_VALUES = Object.fromEntries(
  ASSUMPTIONS.map((assumption) => [assumption.key, assumption.defaultValue]),
) as AssumptionValues;

export function getAssumptionSliderMax(
  key: AssumptionKey,
  values: AssumptionValues,
) {
  if (key === "initialLongCovidMild") {
    return 100 - values.initialLongCovidSignificant;
  }
  if (key === "initialLongCovidSignificant") {
    return 100 - values.initialLongCovidMild;
  }
  return ASSUMPTIONS_BY_KEY[key].sliderMax;
}

export const groupedInterventions = ASSUMPTIONS.reduce(
  (groups, assumption) => {
    groups[assumption.group].push(assumption);
    return groups;
  },
  {
    initialStates: [] as Assumption[],
    interventionParameters: [] as Assumption[],
  },
);

export type InterventionReductionFactors = Record<string, number>;
