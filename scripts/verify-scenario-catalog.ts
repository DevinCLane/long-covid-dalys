import assert from "node:assert/strict";
import chartData from "../src/data/data-2026-09-14.json";

// Simulate a future export in memory, without modifying the source JSON.
const additions = [
  { sourceId: "hepa_most_public", id: "hepa_new_venue", intervention: "hepa" },
  {
    sourceId: "far_uvc_most_public",
    id: "far_uvc_new_venue",
    intervention: "uvc",
  },
] as const;
for (const addition of additions) {
  const source = chartData.main_scenarios.find(
    (scenario) => scenario.id === addition.sourceId,
  );
  assert.ok(source);
  chartData.main_scenarios.push({
    ...source,
    id: addition.id,
    label: `New venue: ${addition.intervention}`,
  });
}

// Load the catalog after adding scenarios to exercise discovery at startup.
const {
  SCENARIO_IDS,
  SCENARIO_LABELS_BY_ID,
  PHARMACEUTICAL_INTERVENTION_SCENARIO_IDS,
  calculateScenarioDalyRows,
} = await import("../src/config/scenario-daly-calculations");
const { DEFAULT_ASSUMPTION_VALUES, interventionsByScenario } =
  await import("../src/config/assumptions");
const rows = calculateScenarioDalyRows({ ...DEFAULT_ASSUMPTION_VALUES });
assert.equal(rows.length, chartData.main_scenarios.length + 4);
assert.equal(new Set(SCENARIO_IDS).size, rows.length);
assert.deepEqual(interventionsByScenario.baseline, []);
assert.equal(interventionsByScenario.unknown_scenario, undefined);
assert.equal(PHARMACEUTICAL_INTERVENTION_SCENARIO_IDS.size, 4);

for (const addition of additions) {
  assert.ok(SCENARIO_IDS.includes(addition.id));
  assert.equal(
    SCENARIO_LABELS_BY_ID.get(addition.id),
    `New venue: ${addition.intervention}`,
  );
  assert.deepEqual(interventionsByScenario[addition.id], [
    addition.intervention,
  ]);
  assert.ok(!PHARMACEUTICAL_INTERVENTION_SCENARIO_IDS.has(addition.id));
  const row = rows.find((candidate) => candidate.id === addition.id);
  const source = rows.find((candidate) => candidate.id === addition.sourceId);
  assert.ok(row && source);
  assert.equal(row.total, source.total);
  assert.equal(row.percent_reduction, source.percent_reduction);
}

console.log(
  "New JSON air-cleaning scenarios appear in the catalog, intervention lookup, and calculated rows.",
);
