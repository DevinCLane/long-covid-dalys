import chartData from "@/data/data-2026-08-28.json";
import { runAcuteCovid, runLongCovid, runPasc } from "@/config/daly-model";

export interface ScenarioDalyRow {
  id: string;
  label: string;
  annualInfectionProportion: number;
  acute_covid: number;
  long_covid: number;
  pasc: number;
  total: number;
  percent_reduction: number;
  percent_reduction_acute_covid: number;
  percent_reduction_long_covid: number;
  percent_reduction_pasc: number;
}

interface ScenarioDalyTotals {
  id: string;
  label: string;
  annualInfectionProportion: number;
  acute_covid: number;
  long_covid: number;
  pasc: number;
  total: number;
}

function calculatePercentReduction(baseline: number, current: number) {
  if (baseline === 0) return 0;
  return Number((((baseline - current) / baseline) * 100).toFixed(2));
}

/**
 * Recalculate DALYs for every scenario after changing the baseline annual
 * infection rate. Each intervention keeps the same proportional reduction in
 * infections that it has in the source scenario data.
 */
export function calculateScenarioDalyRows(
  baselineInfectionRatePercent: number,
): ScenarioDalyRow[] {
  const sourceBaseline = chartData.main_scenarios.find(
    (scenario) => scenario.id === "baseline",
  );

  if (!sourceBaseline) {
    throw new Error("couldn't find the baseline scenario in the data");
  }

  const selectedBaselineProportion = baselineInfectionRatePercent * 0.01;
  const sourceBaselineProportion =
    sourceBaseline.annual_sars_cov_2_infection_proportion;

  const scenarioTotals: ScenarioDalyTotals[] = chartData.main_scenarios.map(
    (scenario) => {
      const scenarioReductionMultiplier =
        scenario.annual_sars_cov_2_infection_proportion /
        sourceBaselineProportion;
      const annualInfectionProportion =
        selectedBaselineProportion * scenarioReductionMultiplier;

      const acuteCovid = runAcuteCovid({
        userOptions: { annualInfectionProportion },
      }).totals.dalysPer1000;
      const longCovid = runLongCovid({
        userOptions: { annualInfectionProportion },
      }).totals.dalysPer1000;
      const pasc = runPasc({
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

  const baselineTotals = scenarioTotals.find(
    (scenario) => scenario.id === "baseline",
  );

  if (!baselineTotals) {
    throw new Error("couldn't calculate the baseline scenario");
  }

  return scenarioTotals.map((scenario) => ({
    ...scenario,
    percent_reduction: calculatePercentReduction(
      baselineTotals.total,
      scenario.total,
    ),
    percent_reduction_acute_covid: calculatePercentReduction(
      baselineTotals.acute_covid,
      scenario.acute_covid,
    ),
    percent_reduction_long_covid: calculatePercentReduction(
      baselineTotals.long_covid,
      scenario.long_covid,
    ),
    percent_reduction_pasc: calculatePercentReduction(
      baselineTotals.pasc,
      scenario.pasc,
    ),
  }));
}
