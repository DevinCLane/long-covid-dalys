# JavaScript DALY Model

This document describes `daly-model.ts`, which is a browser-compatible implementation of the approved
Acute COVID, Long COVID, and PASC calculations.

PASC is included as an evidence-reviewed six-component aggregate. Its browser
calculations match the R reference outputs. Named sensitivity ranges preserve
scientific parameter uncertainty and are not confidence intervals.

## Public functions

```js
import { runAcuteCovid, runLongCovid, runPasc } from "./model/daly-model.js";

const baseline = runLongCovid();
console.log(baseline.totals.dalysPer1000);
console.log(runPasc().totals.dalysPer1000);

const exploratory = runLongCovid({
  disabilityWeightS1: 0.09,
  disabilityWeightS2: 0.36,
  progressionRate: 0.09,
  improvementRate: 0.1,
});
```

Pre-exposure prophylaxis uses the validated scenario formula:

```js
const effectiveInfection = infectionUnderPreExposureProphylaxis({
  baselineInfectionProportion: 0.2874,
  adoption: 0.5,
  efficacy: 0.7,
});
const result = runLongCovid(
  {},
  {
    annualInfectionProportion: effectiveInfection,
  },
);
```

Rates must be supplied as proportions: enter `0.10`, not `10`, for a displayed
10% continuous-time rate. Initial H, S1, and S2 proportions must sum to 1.

The module uses no external runtime dependencies. Its matrix exponential is a
scaling-and-squaring order-13 Pade implementation corresponding to the role of
`expm::expm()` in R.

## Validation

Run:

```bash
npm run validate
```

The validation suite compares JavaScript outputs with R-generated results for:

- Acute COVID, Long COVID, and PASC under all seven infection scenarios;
- all six PASC component results and their named range endpoints;
- Long COVID disability-weight reductions of 5%, 10%, and 20%;
- Long COVID disease-progression reductions of 5%, 10%, and 20%; and
- invalid parameter inputs.

Do not deploy modifications unless the validation suite passes.

Validation counts include different kinds of checks and must not be described
as equally independent evidence. The suite contains R-versus-JavaScript outcome
comparisons, scenario-input mapping checks, and input-guard checks. Model-output
comparisons are the primary cross-language evidence; mapping and guard checks
verify configuration and model-function behavior.

The exported `AIR_CLEANING_SCENARIOS` object and
`infectionForAirCleaningScenario()` function provide the seven approved
baseline, HEPA, and Far UVC infection inputs. The demo resets prophylaxis to 0%
when an air-cleaning scenario is selected. A user may subsequently combine the
two interventions, but the interface labels that result as an exploratory
combination rather than an approved scenario.

`infectionUnderAirCleaningImplementation()` supports 0%, 25%, 50%, 75%, and
100% implementation using linear interpolation between the 28.74% baseline
and the selected full-intervention infection proportion. The validation suite
reads 30 R-generated reference rows covering all six active air-cleaning
scenarios at all five implementation levels.

The user interface presents 25%, 50%, 75%, and 100% for active air-cleaning
interventions. Selecting the baseline/no-intervention scenario represents 0%
and disables the implementation slider as not applicable.

The air-cleaning figure uses one bar each for Acute COVID, Long COVID, and PASC.
The three bars update to the implementation level selected by the user and use
a fixed baseline scale so changes in magnitude remain visually comparable.

The demo also presents explicit Long COVID-only treatment controls for 0%, 5%,
10%, and 20% disability-weight and disease-progression reductions. The
disability control changes both S1 and S2 weights together; the progression
control changes the S1-to-S2 rate. Neither control changes Acute COVID.

## Local interactive prototype

The `demo/` folder contains a dependency-free dashboard prototype connected
directly to the JavaScript model. Open `demo/index.html` directly, or serve the
`javascript/` folder with any local web server and open `/demo/`. Every
infection-prevention control recalculates Acute COVID, Long COVID, and PASC
DALYs immediately in the browser.

The demo also includes a generated classic-script bundle so `demo/index.html`
remains interactive when opened directly from the filesystem. Rebuild it after
changing either `model/daly-model.js` or `demo/app.js`:

```bash
npm run build-demo
```

## Dashboard field mapping

| Dashboard label                  | JavaScript input     | Baseline UI value | Value passed to model |
| -------------------------------- | -------------------- | ----------------: | --------------------: |
| No Long COVID                    | `initialState.H`     |             95.6% |               `0.956` |
| Sick                             | `initialState.S1`    |              3.1% |               `0.031` |
| Sicker                           | `initialState.S2`    |              1.3% |               `0.013` |
| Baseline Long COVID onset rate   | `baselineOnsetRate`  |              2.5% |               `0.025` |
| Annual recovery rate             | `recoveryRate`       |               10% |                `0.10` |
| Annual disease progression rate  | `progressionRate`    |               10% |                `0.10` |
| Annual S2-to-S1 improvement rate | `improvementRate`    |               10% |                `0.10` |
| Sick disability weight           | `disabilityWeightS1` |              0.10 |                `0.10` |
| Sicker disability weight         | `disabilityWeightS2` |              0.40 |                `0.40` |

The three initial-state inputs must sum to 100%. The four transition inputs
are continuous-time rates displayed as percentages; they are not exact annual
transition probabilities. Disability weights are values between 0 and 1 and
should not be percentage-formatted.
