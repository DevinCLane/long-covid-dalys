import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ASSUMPTION_VALUES } from "../src/config/assumptions";
import { isTabId } from "../src/config/iframe-messages";
import chartData from "../src/data/data-2026-09-14.json";
import { longCovidMedicationChartMetric } from "../src/lib/chart-metric";
import {
  calculateScenarioDalyRows,
  LONG_COVID_MEDICATION_SCENARIO_IDS,
  PROPHYLACTIC_MEDICATION_SCENARIO_IDS,
} from "../src/config/scenario-daly-calculations";

test("medication tabs accept iframe state and use separate scenario groups", () => {
  assert.ok(isTabId("prophylaxis"));
  assert.ok(isTabId("longCovidMedication"));
  assert.equal(isTabId("pharmaceuticals"), false);
  assert.deepEqual(
    [...PROPHYLACTIC_MEDICATION_SCENARIO_IDS],
    ["preexposure_prophylaxis", "postexposure_prophylaxis"],
  );
  assert.deepEqual(
    [...LONG_COVID_MEDICATION_SCENARIO_IDS],
    [
      "long_covid_progression_reduction",
      "long_covid_progression_reduction_substantial",
      "long_covid_disability_reduction",
      "long_covid_disability_reduction_substantial",
    ],
  );
});

test("medication percentages match the JSON Long COVID treatment outcomes", () => {
  const rows = calculateScenarioDalyRows(DEFAULT_ASSUMPTION_VALUES);
  for (const [id, level, intervention] of [
    ["long_covid_progression_reduction", 10, "Disease-progression reduction"],
    [
      "long_covid_progression_reduction_substantial",
      20,
      "Disease-progression reduction",
    ],
    ["long_covid_disability_reduction", 10, "Disability-weight reduction"],
    [
      "long_covid_disability_reduction_substantial",
      20,
      "Disability-weight reduction",
    ],
  ] as const) {
    const row = rows.find((candidate) => candidate.id === id)!;
    const source = chartData.interventions.long_covid_treatments.find(
      (candidate) =>
        candidate.intervention === intervention &&
        candidate.level_percent === level,
    )!;
    assert.ok(
      Math.abs(row.long_covid - source.five_year_dalys_per_1000) < 1e-9,
    );
    assert.equal(
      row.percent_dalys_averted_vs_no_intervention,
      Number(source.percent_dalys_averted_vs_no_intervention.toFixed(2)),
    );
    assert.ok(
      row.percent_dalys_averted_vs_no_intervention > row.percent_reduction,
    );
  }
  for (const isMobile of [false, true]) {
    assert.equal(
      longCovidMedicationChartMetric("percent", isMobile).dataKey,
      "percent_dalys_averted_vs_no_intervention",
    );
  }
  assert.equal(longCovidMedicationChartMetric("dalys", false).dataKey, "total");
  assert.equal(
    longCovidMedicationChartMetric("averted", false).dataKey,
    "dalys_averted",
  );
});

test("substantial symptom-burden assumptions affect only their own scenario", () => {
  const original = calculateScenarioDalyRows(DEFAULT_ASSUMPTION_VALUES);
  const changed = calculateScenarioDalyRows({
    ...DEFAULT_ASSUMPTION_VALUES,
    longCovidDisabilityReductionSubstantial: 50,
  });
  for (const row of changed) {
    const originalRow = original.find((candidate) => candidate.id === row.id)!;
    if (row.id === "long_covid_disability_reduction_substantial") {
      assert.ok(row.long_covid < originalRow.long_covid);
      assert.ok(
        row.percent_dalys_averted_vs_no_intervention >
          originalRow.percent_dalys_averted_vs_no_intervention,
      );
      assert.equal(row.acute_covid, originalRow.acute_covid);
      assert.equal(row.pasc, originalRow.pasc);
    } else {
      assert.deepEqual(row, originalRow);
    }
  }
});

test("Long COVID symptom-burden assumptions affect only their own scenario", () => {
  const original = calculateScenarioDalyRows(DEFAULT_ASSUMPTION_VALUES);
  const changed = calculateScenarioDalyRows({
    ...DEFAULT_ASSUMPTION_VALUES,
    longCovidDisabilityReduction: 100,
  });
  for (const row of changed) {
    const originalRow = original.find((candidate) => candidate.id === row.id)!;
    if (row.id === "long_covid_disability_reduction") {
      assert.ok(row.long_covid < originalRow.long_covid);
      assert.ok(row.total < originalRow.total);
      assert.equal(row.acute_covid, originalRow.acute_covid);
      assert.equal(row.pasc, originalRow.pasc);
    } else {
      assert.deepEqual(row, originalRow);
    }
  }
});
