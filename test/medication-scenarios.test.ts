import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ASSUMPTION_VALUES } from "../src/config/assumptions";
import { isTabId } from "../src/config/iframe-messages";
import {
  calculateScenarioDalyRows,
  LONG_COVID_MEDICATION_SCENARIO_IDS,
  PROPHYLACTIC_MEDICATION_SCENARIO_IDS,
} from "../src/config/scenario-daly-calculations";

test("medication tabs accept iframe state and use separate scenario groups", () => {
  assert.ok(isTabId("prophylaxis"));
  assert.ok(isTabId("longCovidMedication"));
  assert.deepEqual(
    [...PROPHYLACTIC_MEDICATION_SCENARIO_IDS],
    ["preexposure_prophylaxis", "postexposure_prophylaxis"],
  );
  assert.deepEqual(
    [...LONG_COVID_MEDICATION_SCENARIO_IDS],
    ["long_covid_progression_reduction", "long_covid_disability_reduction"],
  );
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
