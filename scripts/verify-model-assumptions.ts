import assert from "node:assert/strict";
import { DEFAULT_ASSUMPTION_VALUES } from "../src/config/assumptions";
import {
  approvedStatusQuoDalysPer1000,
  outcomePercentReductionsVsApprovedStatusQuo,
  percentReductionVsApprovedStatusQuo,
  runAcuteCovid,
  runLongCovid,
  runPasc,
} from "../src/config/daly-model";
import { calculateScenarioDalyRows } from "../src/config/scenario-daly-calculations";

function close(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
}

// Independent default outputs from the supplied JavaScript reference.
const approved = approvedStatusQuoDalysPer1000();
close(approved.acuteCovid, 34.49958808055433);
close(approved.longCovid, 60.49011476102541);
close(approved.pasc, 134.25073280063404);
close(approved.total, 229.24043564221378);
assert.ok(Object.isFrozen(approved));
assert.deepEqual(outcomePercentReductionsVsApprovedStatusQuo(approved), {
  acuteCovid: 0,
  longCovid: 0,
  pasc: 0,
  total: 0,
});
assert.equal(percentReductionVsApprovedStatusQuo(0, 100), 100);
assert.equal(percentReductionVsApprovedStatusQuo(150, 100), -50);
for (const invalid of [-1, NaN, Infinity]) {
  assert.throws(
    () => percentReductionVsApprovedStatusQuo(invalid, 100),
    RangeError,
  );
}
for (const invalid of [0, -1, NaN, Infinity]) {
  assert.throws(
    () => percentReductionVsApprovedStatusQuo(1, invalid),
    RangeError,
  );
}

const defaults = calculateScenarioDalyRows({ ...DEFAULT_ASSUMPTION_VALUES });
const defaultBaseline = defaults.find((row) => row.id === "baseline")!;
assert.equal(defaultBaseline.percent_reduction, 0);
close(defaultBaseline.total, approved.total);

for (const overrides of [
  { annualCovidInfectionRate: 0 },
  { annualCovidInfectionRate: 50 },
  { longCovidRate: 20 },
  { acuteCovidDisabilityWeight: 0.1 },
  { otherSequelaeDisabilityWeight: 2 },
  { riskDeathAcuteCovid: 2, riskDeathPasc: 2 },
]) {
  const rows = calculateScenarioDalyRows({
    ...DEFAULT_ASSUMPTION_VALUES,
    ...overrides,
  });
  assert.notEqual(
    rows.find((row) => row.id === "baseline")!.percent_reduction,
    0,
  );
  for (const row of rows) {
    for (const [current, baseline, actual] of [
      [row.total, approved.total, row.percent_reduction],
      [row.acute_covid, approved.acuteCovid, row.percent_reduction_acute_covid],
      [row.long_covid, approved.longCovid, row.percent_reduction_long_covid],
      [row.pasc, approved.pasc, row.percent_reduction_pasc],
    ]) {
      close(
        actual,
        Number(((100 * (baseline - current)) / baseline).toFixed(2)),
      );
    }
  }
}
assert.deepEqual(
  calculateScenarioDalyRows({ ...DEFAULT_ASSUMPTION_VALUES }),
  defaults,
);
assert.deepEqual(approvedStatusQuoDalysPer1000(), approved);

// Preserve app-specific sensitivity controls and the legacy onset alias.
close(
  runAcuteCovid({ userParameters: { mortalityMultiplier: 0 } }).totals.yll,
  0,
);
const noPascMortality = runPasc({ userParameters: { mortalityMultiplier: 0 } });
for (const component of Object.values(noPascMortality.components))
  close(component.totals.yll, 0);
close(
  runPasc({ userParameters: { disabilityWeightMultiplier: 0 } }).totals.yld,
  0,
);
assert.deepEqual(
  runLongCovid({ userParameters: { baselineOnsetRate: 0.1 } }),
  runLongCovid({ userParameters: { onsetRiskPerInfection: 0.1 } }),
);
const longCovid = runLongCovid({
  userParameters: { onsetRiskPerInfection: 0.02, baselineOnsetRate: 0.9 },
  userOptions: { annualInfectionProportion: 0.5 },
});
close(longCovid.parametersUsed.effectiveOnsetRate, 0.01);
assert.ok(longCovid.yearly[0].occupancyBeforeReplacement[3] > 0);
assert.ok(longCovid.yearly[0].occupancyBeforeReplacement[4] > 0);
console.log(
  "Model reference outputs, fixed-baseline percentages, reset behavior, and sensitivity controls verified.",
);
