// Browser-compatible JavaScript implementation of the approved Acute COVID
// and Long COVID DALY calculations. PASC is intentionally not implemented
// pending validation of the R source model.

export const BASELINE_INFECTION_PROPORTION = 0.2874;
export const ADULT_WEIGHTED_BACKGROUND_MORTALITY = 0.011119050095386883;
export const ADULT_WEIGHTED_REMAINING_LIFE_EXPECTANCY = 41.926785696988041;

export const AIR_CLEANING_SCENARIOS = Object.freeze({
  baseline: Object.freeze({
    label: "Baseline — no air-cleaning intervention",
    annualInfectionProportion: 0.2874,
  }),
  hepa_most_public: Object.freeze({
    label: "HEPA in most common indoor air",
    annualInfectionProportion: 0.2644,
  }),
  hepa_schools_and_daycares: Object.freeze({
    label: "HEPA schools and daycares",
    annualInfectionProportion: 0.2404,
  }),
  hepa_all_public: Object.freeze({
    label: "HEPA all public indoor air",
    annualInfectionProportion: 0.1099,
  }),
  far_uvc_most_public: Object.freeze({
    label: "Far UVC in most common indoor air",
    annualInfectionProportion: 0.2529,
  }),
  far_uvc_schools_and_daycares: Object.freeze({
    label: "Far UVC schools and daycares",
    annualInfectionProportion: 0.2263,
  }),
  far_uvc_all_public: Object.freeze({
    label: "Far UVC all public indoor air",
    annualInfectionProportion: 0.0553,
  }),
});

export function infectionForAirCleaningScenario(scenarioId) {
  const scenario = AIR_CLEANING_SCENARIOS[scenarioId];
  if (!scenario)
    throw new RangeError(`Unknown air-cleaning scenario: ${scenarioId}`);
  return scenario.annualInfectionProportion;
}

export function infectionUnderAirCleaningImplementation({
  scenarioId,
  implementation = 1,
  baselineInfectionProportion = BASELINE_INFECTION_PROPORTION,
}) {
  assertUnitInterval(implementation, "implementation");
  assertUnitInterval(
    baselineInfectionProportion,
    "baselineInfectionProportion",
  );
  const fullImplementationInfection =
    infectionForAirCleaningScenario(scenarioId);
  return (
    baselineInfectionProportion -
    implementation * (baselineInfectionProportion - fullImplementationInfection)
  );
}

export const DEFAULT_LONG_COVID_PARAMETERS = Object.freeze({
  initialState: Object.freeze({ H: 0.956, S1: 0.031, S2: 0.013 }),
  baselineOnsetRate: 0.025,
  recoveryRate: 0.1,
  progressionRate: 0.1,
  improvementRate: 0.1,
  mortalityHazardRatioS1: 1.001,
  mortalityHazardRatioS2: 1.005,
  disabilityWeightS1: 0.1,
  disabilityWeightS2: 0.4,
});

export const DEFAULT_ACUTE_COVID_PARAMETERS = Object.freeze({
  durationWeightedDisability: 0.00888944,
  caseFatalityRate: 0.0005760242424,
});

export function infectionUnderPreExposureProphylaxis({
  baselineInfectionProportion = BASELINE_INFECTION_PROPORTION,
  adoption = 0,
  efficacy = 0.7,
} = {}) {
  assertUnitInterval(
    baselineInfectionProportion,
    "baselineInfectionProportion",
  );
  assertUnitInterval(adoption, "adoption");
  assertUnitInterval(efficacy, "efficacy");
  return baselineInfectionProportion * (1 - efficacy * adoption);
}

const STATE_INDEX = Object.freeze({ H: 0, S1: 1, S2: 2, DOC: 3, DS: 4 });
const PADE_COEFFICIENTS = [
  64764752532480000, 32382376266240000, 7771770303897600, 1187353796428800,
  129060195264000, 10559470521600, 670442572800, 33522128640, 1323241920,
  40840800, 960960, 16380, 182, 1,
];

function assertFiniteNonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, nonnegative number.`);
  }
}

function assertUnitInterval(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1.`);
  }
}

function zeros(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function identity(size) {
  const result = zeros(size, size);
  for (let i = 0; i < size; i += 1) result[i][i] = 1;
  return result;
}

function add(a, b) {
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

function subtract(a, b) {
  return a.map((row, i) => row.map((value, j) => value - b[i][j]));
}

function scale(a, scalar) {
  return a.map((row) => row.map((value) => value * scalar));
}

function multiply(a, b) {
  const result = zeros(a.length, b[0].length);
  for (let i = 0; i < a.length; i += 1) {
    for (let k = 0; k < b.length; k += 1) {
      for (let j = 0; j < b[0].length; j += 1) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function multiplyRowVector(vector, matrix) {
  return matrix[0].map((_, column) =>
    vector.reduce((sum, value, row) => sum + value * matrix[row][column], 0),
  );
}

function oneNorm(matrix) {
  let maximum = 0;
  for (let column = 0; column < matrix[0].length; column += 1) {
    let sum = 0;
    for (let row = 0; row < matrix.length; row += 1) {
      sum += Math.abs(matrix[row][column]);
    }
    maximum = Math.max(maximum, sum);
  }
  return maximum;
}

// Solve A * X = B using Gaussian elimination with partial pivoting.
function solve(a, b) {
  const n = a.length;
  const rhsColumns = b[0].length;
  const augmented = a.map((row, i) => [...row, ...b[i]]);

  for (let column = 0; column < n; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < n; row += 1) {
      if (
        Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])
      ) {
        pivot = row;
      }
    }
    if (Math.abs(augmented[pivot][column]) < Number.EPSILON) {
      throw new Error(
        "Matrix exponential encountered a singular linear system.",
      );
    }
    [augmented[column], augmented[pivot]] = [
      augmented[pivot],
      augmented[column],
    ];

    const pivotValue = augmented[column][column];
    for (let j = column; j < n + rhsColumns; j += 1) {
      augmented[column][j] /= pivotValue;
    }

    for (let row = 0; row < n; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let j = column; j < n + rhsColumns; j += 1) {
        augmented[row][j] -= factor * augmented[column][j];
      }
    }
  }
  return augmented.map((row) => row.slice(n));
}

// Scaling-and-squaring matrix exponential using the order-13 Padé
// approximation described by Higham. This replaces R's expm::expm(Q).
export function matrixExponential(matrix) {
  const size = matrix.length;
  if (!matrix.every((row) => row.length === size)) {
    throw new TypeError("matrixExponential requires a square matrix.");
  }

  const theta13 = 5.371920351148152;
  const squarings = Math.max(
    0,
    Math.ceil(Math.log2(oneNorm(matrix) / theta13)),
  );
  const a = scale(matrix, 1 / 2 ** squarings);
  const a2 = multiply(a, a);
  const a4 = multiply(a2, a2);
  const a6 = multiply(a4, a2);
  const i = identity(size);
  const b = PADE_COEFFICIENTS;

  const uInner = add(
    multiply(a6, add(add(scale(a6, b[13]), scale(a4, b[11])), scale(a2, b[9]))),
    add(
      add(scale(a6, b[7]), scale(a4, b[5])),
      add(scale(a2, b[3]), scale(i, b[1])),
    ),
  );
  const u = multiply(a, uInner);
  const v = add(
    multiply(a6, add(add(scale(a6, b[12]), scale(a4, b[10])), scale(a2, b[8]))),
    add(
      add(scale(a6, b[6]), scale(a4, b[4])),
      add(scale(a2, b[2]), scale(i, b[0])),
    ),
  );

  let result = solve(subtract(v, u), add(v, u));
  for (let count = 0; count < squarings; count += 1) {
    result = multiply(result, result);
  }
  return result;
}

function discountedLifeExpectancy(lifeExpectancy, discountRate) {
  if (discountRate === 0) return lifeExpectancy;
  return -Math.expm1(-discountRate * lifeExpectancy) / discountRate;
}

function transitionRateMatrix(parameters, backgroundMortalityRate) {
  const diseaseDeathS1 = Math.max(
    0,
    parameters.mortalityHazardRatioS1 * backgroundMortalityRate -
      backgroundMortalityRate,
  );
  const diseaseDeathS2 = Math.max(
    0,
    parameters.mortalityHazardRatioS2 * backgroundMortalityRate -
      backgroundMortalityRate,
  );

  const {
    baselineOnsetRate: rHS1,
    recoveryRate: rS1H,
    progressionRate: rS1S2,
    improvementRate: rS2S1,
  } = parameters;
  const rHD = backgroundMortalityRate;

  return [
    [-(rHD + rHS1), rHS1, 0, rHD, 0],
    [rS1H, -(rS1H + rS1S2 + rHD + diseaseDeathS1), rS1S2, rHD, diseaseDeathS1],
    [0, rS2S1, -(rS2S1 + rHD + diseaseDeathS2), rHD, diseaseDeathS2],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
}

function validateLongCovidInputs(parameters, options) {
  const initialValues = Object.values(parameters.initialState);
  initialValues.forEach((value, i) =>
    assertUnitInterval(value, `initialState[${i}]`),
  );
  const total = initialValues.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-10) {
    throw new RangeError("Initial H, S1, and S2 proportions must sum to 1.");
  }
  [
    "baselineOnsetRate",
    "recoveryRate",
    "progressionRate",
    "improvementRate",
    "mortalityHazardRatioS1",
    "mortalityHazardRatioS2",
  ].forEach((name) => assertFiniteNonnegative(parameters[name], name));
  assertUnitInterval(parameters.disabilityWeightS1, "disabilityWeightS1");
  assertUnitInterval(parameters.disabilityWeightS2, "disabilityWeightS2");
  assertUnitInterval(
    options.annualInfectionProportion,
    "annualInfectionProportion",
  );
  assertFiniteNonnegative(
    options.backgroundMortalityRate,
    "backgroundMortalityRate",
  );
  assertFiniteNonnegative(
    options.remainingLifeExpectancy,
    "remainingLifeExpectancy",
  );
  assertFiniteNonnegative(options.discountRate, "discountRate");
  if (!Number.isInteger(options.horizonYears) || options.horizonYears < 1) {
    throw new RangeError("horizonYears must be a positive integer.");
  }
}

export function runLongCovid(userParameters = {}, userOptions = {}) {
  const parameters = {
    ...DEFAULT_LONG_COVID_PARAMETERS,
    ...userParameters,
    initialState: {
      ...DEFAULT_LONG_COVID_PARAMETERS.initialState,
      ...(userParameters.initialState ?? {}),
    },
  };
  const options = {
    horizonYears: 5,
    annualInfectionProportion: BASELINE_INFECTION_PROPORTION,
    scaleOnsetByInfection: true,
    stablePopulation: true,
    stableReplacement: "H",
    backgroundMortalityRate: ADULT_WEIGHTED_BACKGROUND_MORTALITY,
    remainingLifeExpectancy: ADULT_WEIGHTED_REMAINING_LIFE_EXPECTANCY,
    discountRate: 0.001,
    populationSize: 1000,
    ...userOptions,
  };
  if (options.stableReplacement !== "H") {
    throw new RangeError(
      "This validated JavaScript version supports replacement into H only.",
    );
  }

  if (options.scaleOnsetByInfection) {
    parameters.baselineOnsetRate *=
      options.annualInfectionProportion / BASELINE_INFECTION_PROPORTION;
  }
  validateLongCovidInputs(parameters, options);

  let occupancy = [
    parameters.initialState.H,
    parameters.initialState.S1,
    parameters.initialState.S2,
    0,
    0,
  ];
  const transition = matrixExponential(
    transitionRateMatrix(parameters, options.backgroundMortalityRate),
  );
  const discountedLe = discountedLifeExpectancy(
    options.remainingLifeExpectancy,
    options.discountRate,
  );
  const yearly = [];

  for (let year = 1; year <= options.horizonYears; year += 1) {
    const start = [...occupancy];
    const end = multiplyRowVector(start, transition);
    const discount = Math.exp(-options.discountRate * (year - 0.5));
    const yldStart =
      start[STATE_INDEX.S1] * parameters.disabilityWeightS1 +
      start[STATE_INDEX.S2] * parameters.disabilityWeightS2;
    const yldEnd =
      end[STATE_INDEX.S1] * parameters.disabilityWeightS1 +
      end[STATE_INDEX.S2] * parameters.disabilityWeightS2;
    const yld = 0.5 * (yldStart + yldEnd) * discount;
    const diseaseDeaths = end[STATE_INDEX.DS] - start[STATE_INDEX.DS];
    const yll = diseaseDeaths * discountedLe * discount;

    yearly.push({
      year,
      yld,
      yll,
      daly: yld + yll,
      // Preserve the pre-replacement state. `end` is modified below when the
      // stable population is replenished, so storing the same array reference
      // would make this diagnostic field report post-replacement occupancy.
      occupancyBeforeReplacement: [...end],
    });

    if (options.stablePopulation) {
      const deaths = end[STATE_INDEX.DOC] + end[STATE_INDEX.DS];
      end[STATE_INDEX.H] += deaths;
      end[STATE_INDEX.DOC] = 0;
      end[STATE_INDEX.DS] = 0;
    }
    occupancy = end;
  }

  const yld = yearly.reduce((sum, row) => sum + row.yld, 0);
  const yll = yearly.reduce((sum, row) => sum + row.yll, 0);
  const daly = yld + yll;
  return {
    condition: "long_covid",
    parametersUsed: parameters,
    options,
    yearly,
    totals: {
      yld,
      yll,
      daly,
      dalysPer1000: daly * 1000,
      dalysTotalPopulation: daly * options.populationSize,
    },
  };
}

export function runAcuteCovid(userParameters = {}, userOptions = {}) {
  const parameters = { ...DEFAULT_ACUTE_COVID_PARAMETERS, ...userParameters };
  const options = {
    horizonYears: 5,
    annualInfectionProportion: BASELINE_INFECTION_PROPORTION,
    remainingLifeExpectancy: ADULT_WEIGHTED_REMAINING_LIFE_EXPECTANCY,
    populationSize: 1000,
    ...userOptions,
  };
  assertUnitInterval(
    parameters.durationWeightedDisability,
    "durationWeightedDisability",
  );
  assertUnitInterval(parameters.caseFatalityRate, "caseFatalityRate");
  assertUnitInterval(
    options.annualInfectionProportion,
    "annualInfectionProportion",
  );
  if (!Number.isInteger(options.horizonYears) || options.horizonYears < 1) {
    throw new RangeError("horizonYears must be a positive integer.");
  }

  const annualYld =
    options.annualInfectionProportion * parameters.durationWeightedDisability;
  const annualYll =
    options.annualInfectionProportion *
    parameters.caseFatalityRate *
    options.remainingLifeExpectancy;
  const yearly = Array.from({ length: options.horizonYears }, (_, index) => ({
    year: index + 1,
    yld: annualYld,
    yll: annualYll,
    daly: annualYld + annualYll,
  }));
  const yld = annualYld * options.horizonYears;
  const yll = annualYll * options.horizonYears;
  const daly = yld + yll;
  return {
    condition: "acute_covid",
    parametersUsed: parameters,
    options,
    yearly,
    totals: {
      yld,
      yll,
      daly,
      dalysPer1000: daly * 1000,
      dalysTotalPopulation: daly * options.populationSize,
    },
  };
}
