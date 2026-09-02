import assert from "node:assert/strict";

import {
  DEFAULT_ASSUMPTION_VALUES,
  type AssumptionKey,
} from "../src/config/assumptions";
import { calculateScenarioDalyRows } from "../src/config/scenario-daly-calculations";
import chartData from "../src/data/data-2026-09-02.json";

const tolerance = 1e-8;
const defaultRows = calculateScenarioDalyRows(DEFAULT_ASSUMPTION_VALUES);

for (const sourceScenario of chartData.main_scenarios) {
  const calculated = defaultRows.find(
    (scenario) => scenario.id === sourceScenario.id,
  );
  assert(calculated, `Missing calculated scenario ${sourceScenario.id}`);

  const expected = sourceScenario.outcomes;
  assert(
    Math.abs(calculated.acute_covid - expected.acute_covid.dalys_per_1000) <
      tolerance,
    `${sourceScenario.id} acute COVID default does not match the export`,
  );
  assert(
    Math.abs(calculated.long_covid - expected.long_covid.dalys_per_1000) <
      tolerance,
    `${sourceScenario.id} Long COVID default does not match the export`,
  );
  assert(
    Math.abs(calculated.pasc - expected.pasc.dalys_per_1000) < tolerance,
    `${sourceScenario.id} PASC default does not match the export`,
  );
  assert(
    Math.abs(
      calculated.total -
        expected.acute_plus_long_covid_plus_pasc.dalys_per_1000,
    ) < tolerance,
    `${sourceScenario.id} total default does not match the export`,
  );
  assert.equal(
    calculated.percent_reduction,
    Number(
      expected.acute_plus_long_covid_plus_pasc.percent_reduction_vs_baseline.toFixed(
        2,
      ),
    ),
    `${sourceScenario.id} total percent reduction does not match the export`,
  );
}

const defaultAirCleaningTotals = chartData.interventions.air_cleaning.filter(
  (row) => row.outcome === "Total" && row.level === 1,
);

for (const expected of defaultAirCleaningTotals) {
  const calculated = defaultRows.find(
    (scenario) => scenario.id === expected.intervention,
  );
  assert(calculated, `Missing calculated scenario ${expected.intervention}`);
  assert.equal(
    calculated.percent_reduction,
    Number(expected.percent_dalys_averted_vs_no_intervention.toFixed(2)),
    `${expected.intervention} total percentage does not match the exported Total row`,
  );
}

type WiringCheck = {
  key: AssumptionKey;
  scenarioId: string;
  value: number;
};

const wiringChecks: WiringCheck[] = [
  {
    key: "annualCovidInfectionRate",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.annualCovidInfectionRate + 1,
  },
  {
    key: "longCovidRate",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.longCovidRate + 1,
  },
  {
    key: "disabilityWeightLongCovidMild",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.disabilityWeightLongCovidMild + 0.05,
  },
  {
    key: "disabilityWeightLongCovidSignificant",
    scenarioId: "baseline",
    value:
      DEFAULT_ASSUMPTION_VALUES.disabilityWeightLongCovidSignificant + 0.05,
  },
  {
    key: "acuteCovidDisabilityWeight",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.acuteCovidDisabilityWeight + 0.001,
  },
  {
    key: "otherSequelaeDisabilityWeight",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.otherSequelaeDisabilityWeight + 0.1,
  },
  { key: "riskDeathLongCovidMild", scenarioId: "baseline", value: 2 },
  {
    key: "riskDeathLongCovidSignificant",
    scenarioId: "baseline",
    value: 2,
  },
  { key: "riskDeathAcuteCovid", scenarioId: "baseline", value: 1.1 },
  { key: "riskDeathPasc", scenarioId: "baseline", value: 1.1 },
  {
    key: "rateLongCovidRecovery",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.rateLongCovidRecovery + 5,
  },
  {
    key: "rateLongCovidProgression",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.rateLongCovidProgression + 5,
  },
  {
    key: "rateLongCovidImprovement",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.rateLongCovidImprovement + 5,
  },
  {
    key: "initialLongCovidMild",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.initialLongCovidMild + 1,
  },
  {
    key: "initialLongCovidSignificant",
    scenarioId: "baseline",
    value: DEFAULT_ASSUMPTION_VALUES.initialLongCovidSignificant + 1,
  },
  {
    key: "hepa",
    scenarioId: "hepa_all_public",
    value: DEFAULT_ASSUMPTION_VALUES.hepa - 5,
  },
  {
    key: "uvc",
    scenarioId: "far_uvc_all_public",
    value: DEFAULT_ASSUMPTION_VALUES.uvc - 5,
  },
  {
    key: "preexposureProphylaxis",
    scenarioId: "preexposure_prophylaxis",
    value: DEFAULT_ASSUMPTION_VALUES.preexposureProphylaxis - 5,
  },
  {
    key: "postexposureProphylaxis",
    scenarioId: "postexposure_prophylaxis",
    value: DEFAULT_ASSUMPTION_VALUES.postexposureProphylaxis - 5,
  },
  {
    key: "interventionDecreaseProgression",
    scenarioId: "long_covid_progression_reduction",
    value: DEFAULT_ASSUMPTION_VALUES.interventionDecreaseProgression + 5,
  },
  {
    key: "interventionDecreaseSymptoms",
    scenarioId: "long_covid_disability_reduction",
    value: DEFAULT_ASSUMPTION_VALUES.interventionDecreaseSymptoms + 5,
  },
];

for (const check of wiringChecks) {
  const defaultScenario = defaultRows.find(
    (scenario) => scenario.id === check.scenarioId,
  );
  assert(defaultScenario, `Missing default scenario ${check.scenarioId}`);

  const changedRows = calculateScenarioDalyRows({
    ...DEFAULT_ASSUMPTION_VALUES,
    [check.key]: check.value,
  });
  const changedScenario = changedRows.find(
    (scenario) => scenario.id === check.scenarioId,
  );
  assert(changedScenario, `Missing changed scenario ${check.scenarioId}`);
  assert.notEqual(
    changedScenario.total,
    defaultScenario.total,
    `${check.key} did not change ${check.scenarioId}`,
  );
}

console.log(
  `Verified ${chartData.main_scenarios.length} exported scenarios and ${wiringChecks.length} live assumption mappings.`,
);
