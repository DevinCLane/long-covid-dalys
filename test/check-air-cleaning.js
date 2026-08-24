import { infectionUnderAirCleaningImplementation } from "../src/config/daly-model.js";
import { runLongCovid, runAcuteCovid } from "../src/config/daly-model.js";
import { AIR_CLEANING_SCENARIOS } from "../src/config/daly-model.js";

const hepaInfectionPartial = infectionUnderAirCleaningImplementation({
  scenarioId: "hepa_most_public",
  implementation: 0.5,
});
console.log(hepaInfectionPartial);

console.log("initial acute covid", runAcuteCovid());
console.log(
  "50% implmentation",
  runAcuteCovid({}, { annualInfectionProportion: hepaInfectionPartial }),
);
console.log("initial long covid", runLongCovid());
console.log(
  "50% implmentation",
  runLongCovid({}, { annualInfectionProportion: hepaInfectionPartial }),
);
