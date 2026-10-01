import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ASSUMPTION_VALUES } from "../src/config/assumptions";
import { approvedStatusQuoDalysPer1000 } from "../src/config/daly-model";
import { isMetric } from "../src/config/iframe-messages";
import { calculateScenarioDalyRows } from "../src/config/scenario-daly-calculations";

test("default status quo averts zero DALYs and outcome savings sum to total savings", () => {
  const rows = calculateScenarioDalyRows(DEFAULT_ASSUMPTION_VALUES);
  const baseline = rows.find((row) => row.id === "baseline")!;
  for (const key of [
    "dalys_averted",
    "dalys_averted_acute_covid",
    "dalys_averted_long_covid",
    "dalys_averted_pasc",
  ] as const) {
    assert.equal(baseline[key], 0);
  }
  for (const row of rows) {
    assert.ok(row.dalys_averted >= 0);
    assert.ok(
      Math.abs(
        row.dalys_averted -
          (row.dalys_averted_acute_covid +
            row.dalys_averted_long_covid +
            row.dalys_averted_pasc),
      ) < 1e-9,
    );
  }
});

test("adjusted assumptions retain the default reference and allow negative savings", () => {
  const approved = approvedStatusQuoDalysPer1000();
  const rows = calculateScenarioDalyRows({
    ...DEFAULT_ASSUMPTION_VALUES,
    annualCovidInfectionRate: 100,
  });
  const baseline = rows.find((row) => row.id === "baseline")!;
  assert.ok(baseline.dalys_averted < 0);
  for (const row of rows) {
    for (const [savings, burden, reference, percent] of [
      [row.dalys_averted, row.total, approved.total, row.percent_reduction],
      [
        row.dalys_averted_acute_covid,
        row.acute_covid,
        approved.acuteCovid,
        row.percent_reduction_acute_covid,
      ],
      [
        row.dalys_averted_long_covid,
        row.long_covid,
        approved.longCovid,
        row.percent_reduction_long_covid,
      ],
      [
        row.dalys_averted_pasc,
        row.pasc,
        approved.pasc,
        row.percent_reduction_pasc,
      ],
    ]) {
      assert.ok(Math.abs(savings + burden - reference) < 1e-9);
      assert.ok(Math.abs((100 * savings) / reference - percent) <= 0.005);
    }
  }
  assert.equal(isMetric("averted"), true);
  assert.equal(isMetric("unknown"), false);
});
