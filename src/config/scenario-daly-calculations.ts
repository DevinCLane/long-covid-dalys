import type { AssumptionKey, AssumptionValues } from "@/config/assumptions";
import {
  approvedStatusQuoDalysPer1000,
  infectionUnderPostExposureProphylaxis,
  infectionUnderPreExposureProphylaxis,
  outcomePercentReductionsVsApprovedStatusQuo,
  runAcuteCovid,
  runLongCovid,
  runPasc,
} from "@/config/daly-model";
import chartData from "@/data/data-2026-09-14.json";

// JSON IDs are strings; the loaded definitions provide the runtime catalog.
export type ScenarioId = (typeof chartData.main_scenarios)[number]["id"];

export interface ScenarioDalyRow {
  id: ScenarioId;
  label: string;
  annualInfectionProportion: number;
  acute_covid: number;
  long_covid: number;
  pasc: number;
  total: number;
  percent_reduction: number;
  percent_dalys_averted_vs_no_intervention: number;
  percent_reduction_acute_covid: number;
  percent_reduction_long_covid: number;
  percent_reduction_pasc: number;
  dalys_averted: number;
  dalys_averted_acute_covid: number;
  dalys_averted_long_covid: number;
  dalys_averted_pasc: number;
}

interface ScenarioDalyTotals {
  id: ScenarioId;
  label: string;
  annualInfectionProportion: number;
  acute_covid: number;
  long_covid: number;
  pasc: number;
  total: number;
}

type BaseLongCovidParameters = {
  initialState: { H: number; S1: number; S2: number };
  onsetRiskPerInfection: number;
  recoveryRate: number;
  progressionRate: number;
  improvementRate: number;
  mortalityHazardRatioS1: number;
  mortalityHazardRatioS2: number;
  disabilityWeightS1: number;
  disabilityWeightS2: number;
};

type ScenarioDefinition = {
  id: ScenarioId;
  label: string;
  interventions: AssumptionKey[];
  annualInfectionProportion: (values: AssumptionValues) => number;
  transformLongCovidParameters?: (
    parameters: BaseLongCovidParameters,
    values: AssumptionValues,
  ) => BaseLongCovidParameters;
};

const sourceBaseline = chartData.main_scenarios.find(
  (scenario) => scenario.id === "baseline",
);

if (!sourceBaseline) {
  throw new Error("couldn't find the baseline scenario in the data");
}

const sourceBaselineInfectionProportion =
  sourceBaseline.annual_sars_cov_2_infection_proportion;

function toProportion(percent: number) {
  return percent * 0.01;
}

function selectedBaseline(values: AssumptionValues) {
  return toProportion(values.annualCovidInfectionRate);
}

function sourceReductionForScenario(
  scenario: (typeof chartData.main_scenarios)[number],
) {
  return (
    1 -
    scenario.annual_sars_cov_2_infection_proportion /
      sourceBaselineInfectionProportion
  );
}

function airScenarioDefinition(
  scenario: (typeof chartData.main_scenarios)[number],
): ScenarioDefinition {
  if (scenario.id === "baseline") {
    return {
      id: scenario.id,
      label: "Status quo",
      interventions: [],
      annualInfectionProportion: selectedBaseline,
    };
  }

  const assumptionKey = scenario.id.startsWith("hepa_")
    ? "hepa"
    : scenario.id.startsWith("far_uvc_")
      ? "uvc"
      : undefined;
  if (!assumptionKey) {
    throw new Error(`Unsupported air-cleaning scenario: ${scenario.id}`);
  }
  const fullImplementationId =
    assumptionKey === "hepa" ? "hepa_all_public" : "far_uvc_all_public";
  const fullImplementationScenario = chartData.main_scenarios.find(
    (candidate) => candidate.id === fullImplementationId,
  );

  if (!fullImplementationScenario) {
    throw new Error(`couldn't find ${fullImplementationId} in the data`);
  }

  const relativeIntensity =
    sourceReductionForScenario(scenario) /
    sourceReductionForScenario(fullImplementationScenario);

  return {
    id: scenario.id,
    label: scenario.label,
    interventions: [assumptionKey],
    annualInfectionProportion: (values) =>
      selectedBaseline(values) *
      (1 - toProportion(values[assumptionKey]) * relativeIntensity),
  };
}

/**
 * Main scenarios come from the validated export. The additional scenario
 * rows expose the intervention sensitivities that are also present in that
 * export, while allowing their selected level to remain live.
 */
export const SCENARIO_DEFINITIONS: readonly ScenarioDefinition[] = [
  ...chartData.main_scenarios.map(airScenarioDefinition),
  {
    id: "preexposure_prophylaxis",
    label: "Pre-exposure prophylaxis",
    interventions: ["preexposureProphylaxis"],
    annualInfectionProportion: (values) =>
      infectionUnderPreExposureProphylaxis({
        baselineInfectionProportion: selectedBaseline(values),
        adoption: 1,
        efficacy: toProportion(values.preexposureProphylaxis),
      }),
  },
  {
    id: "postexposure_prophylaxis",
    label: "Post-exposure prophylaxis",
    interventions: ["postexposureProphylaxis"],
    annualInfectionProportion: (values) =>
      infectionUnderPostExposureProphylaxis({
        baselineInfectionProportion: selectedBaseline(values),
        implementation: 1,
        maximumPopulationInfectionReduction: toProportion(
          values.postexposureProphylaxis,
        ),
      }),
  },
  {
    id: "long_covid_progression_reduction",
    label: "10% less disease progression",
    interventions: ["longCovidProgressionReduction"],
    annualInfectionProportion: selectedBaseline,
    transformLongCovidParameters: (parameters, values) => ({
      ...parameters,
      progressionRate:
        parameters.progressionRate *
        (1 - toProportion(values.longCovidProgressionReduction)),
    }),
  },
  {
    id: "long_covid_progression_reduction_substantial",
    label: "20% less disease progression",
    interventions: ["longCovidProgressionReductionSubstantial"],
    annualInfectionProportion: selectedBaseline,
    transformLongCovidParameters: (parameters, values) => ({
      ...parameters,
      progressionRate:
        parameters.progressionRate *
        (1 - toProportion(values.longCovidProgressionReductionSubstantial)),
    }),
  },
  {
    id: "long_covid_disability_reduction",
    label: "10% lower symptom burden",
    interventions: ["longCovidDisabilityReduction"],
    annualInfectionProportion: selectedBaseline,
    transformLongCovidParameters: (parameters, values) => {
      const remainingDisability =
        1 - toProportion(values.longCovidDisabilityReduction);
      return {
        ...parameters,
        disabilityWeightS1: parameters.disabilityWeightS1 * remainingDisability,
        disabilityWeightS2: parameters.disabilityWeightS2 * remainingDisability,
      };
    },
  },
  {
    id: "long_covid_disability_reduction_substantial",
    label: "20% lower symptom burden",
    interventions: ["longCovidDisabilityReductionSubstantial"],
    annualInfectionProportion: selectedBaseline,
    transformLongCovidParameters: (parameters, values) => {
      const remainingDisability =
        1 - toProportion(values.longCovidDisabilityReductionSubstantial);
      return {
        ...parameters,
        disabilityWeightS1: parameters.disabilityWeightS1 * remainingDisability,
        disabilityWeightS2: parameters.disabilityWeightS2 * remainingDisability,
      };
    },
  },
];

export const SCENARIO_IDS = SCENARIO_DEFINITIONS.map((scenario) => scenario.id);

if (new Set(SCENARIO_IDS).size !== SCENARIO_IDS.length) {
  throw new Error("Scenario identifiers must be unique");
}

export const SCENARIO_LABELS_BY_ID = new Map(
  SCENARIO_DEFINITIONS.map((scenario) => [scenario.id, scenario.label]),
);

export const PROPHYLACTIC_MEDICATION_SCENARIO_IDS = new Set(
  SCENARIO_DEFINITIONS.filter((scenario) =>
    scenario.interventions.some(
      (intervention) =>
        intervention === "preexposureProphylaxis" ||
        intervention === "postexposureProphylaxis",
    ),
  ).map((scenario) => scenario.id),
);

export const LONG_COVID_MEDICATION_SCENARIO_IDS = new Set(
  SCENARIO_DEFINITIONS.filter((scenario) =>
    scenario.interventions.some(
      (intervention) =>
        intervention === "longCovidProgressionReduction" ||
        intervention === "longCovidProgressionReductionSubstantial" ||
        intervention === "longCovidDisabilityReduction" ||
        intervention === "longCovidDisabilityReductionSubstantial",
    ),
  ).map((scenario) => scenario.id),
);

function buildBaseModelInputs(values: AssumptionValues) {
  const initialS1 = toProportion(values.initialLongCovidMild);
  const initialS2 = toProportion(values.initialLongCovidSignificant);

  return {
    acuteParameters: {
      durationWeightedDisability: values.acuteCovidDisabilityWeight,
      mortalityMultiplier: values.riskDeathAcuteCovid,
    },
    longCovidParameters: {
      initialState: {
        H: 1 - initialS1 - initialS2,
        S1: initialS1,
        S2: initialS2,
      },
      onsetRiskPerInfection: toProportion(values.longCovidRate),
      recoveryRate: toProportion(values.rateLongCovidRecovery),
      progressionRate: toProportion(values.rateLongCovidProgression),
      improvementRate: toProportion(values.rateLongCovidImprovement),
      mortalityHazardRatioS1: values.riskDeathLongCovidMild,
      mortalityHazardRatioS2: values.riskDeathLongCovidSignificant,
      disabilityWeightS1: values.disabilityWeightLongCovidMild,
      disabilityWeightS2: values.disabilityWeightLongCovidSignificant,
    } satisfies BaseLongCovidParameters,
    pascParameters: {
      disabilityWeightMultiplier: values.otherSequelaeDisabilityWeight,
      mortalityMultiplier: values.riskDeathPasc,
    },
  };
}

export function calculateScenarioDalyRows(
  values: AssumptionValues,
): ScenarioDalyRow[] {
  const baseInputs = buildBaseModelInputs(values);
  const approvedStatusQuo = approvedStatusQuoDalysPer1000();

  const scenarioTotals: ScenarioDalyTotals[] = SCENARIO_DEFINITIONS.map(
    (scenario) => {
      const annualInfectionProportion =
        scenario.annualInfectionProportion(values);
      const longCovidParameters = scenario.transformLongCovidParameters
        ? scenario.transformLongCovidParameters(
            baseInputs.longCovidParameters,
            values,
          )
        : baseInputs.longCovidParameters;

      const acuteCovid = runAcuteCovid({
        userParameters: baseInputs.acuteParameters,
        userOptions: { annualInfectionProportion },
      }).totals.dalysPer1000;
      const longCovid = runLongCovid({
        userParameters: longCovidParameters,
        userOptions: { annualInfectionProportion },
      }).totals.dalysPer1000;
      const pasc = runPasc({
        userParameters: baseInputs.pascParameters,
        userOptions: { annualInfectionProportion },
      }).totals.dalysPer1000;

      return {
        id: scenario.id,
        label: scenario.label,
        annualInfectionProportion,
        acute_covid: acuteCovid,
        long_covid: longCovid,
        pasc,
        total: acuteCovid + longCovid + pasc,
      };
    },
  );

  return scenarioTotals.map((scenario) => {
    const reductions = outcomePercentReductionsVsApprovedStatusQuo({
      acuteCovid: scenario.acute_covid,
      longCovid: scenario.long_covid,
      pasc: scenario.pasc,
    });
    return {
      ...scenario,
      dalys_averted: approvedStatusQuo.total - scenario.total,
      dalys_averted_acute_covid:
        approvedStatusQuo.acuteCovid - scenario.acute_covid,
      dalys_averted_long_covid:
        approvedStatusQuo.longCovid - scenario.long_covid,
      dalys_averted_pasc: approvedStatusQuo.pasc - scenario.pasc,
      percent_reduction: Number(reductions.total.toFixed(2)),
      // Outcome-specific percentage from the JSON treatment sensitivity:
      // Long COVID DALYs averted / no-intervention Long COVID DALYs * 100.
      percent_dalys_averted_vs_no_intervention: Number(
        reductions.longCovid.toFixed(2),
      ),
      percent_reduction_acute_covid: Number(reductions.acuteCovid.toFixed(2)),
      percent_reduction_long_covid: Number(reductions.longCovid.toFixed(2)),
      percent_reduction_pasc: Number(reductions.pasc.toFixed(2)),
    };
  });
}
