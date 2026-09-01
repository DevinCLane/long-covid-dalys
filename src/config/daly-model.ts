// Browser-compatible JavaScript implementation of the approved Acute COVID
// and Long COVID DALY calculations. PASC is intentionally not implemented
// pending validation of the R source model.

/**
 * fraction of adult population expected to catch COVID per year with no intervention
 */
export const BASELINE_INFECTION_PROPORTION = 0.2874;
/**
 * average annual death rate for adults weighted across age groups
 */
export const ADULT_WEIGHTED_BACKGROUND_MORTALITY = 0.011119050095386883;
/**
 * average remaining years of life for age weighted adult population
 */
export const ADULT_WEIGHTED_REMAINING_LIFE_EXPECTANCY = 41.926785696988041;

/**
 * lookup table for intervention scenarios
 */
export const AIR_CLEANING_SCENARIOS = Object.freeze({
  baseline: Object.freeze({
    label: "Baseline — no air-cleaning intervention",
    annualInfectionProportion: BASELINE_INFECTION_PROPORTION,
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

/**
 * Access annual infection proportion for a given scenario
 */
export function infectionForAirCleaningScenario(
  scenarioId: keyof typeof AIR_CLEANING_SCENARIOS,
) {
  const scenario = AIR_CLEANING_SCENARIOS[scenarioId];
  if (!scenario)
    throw new RangeError(`Unknown air-cleaning scenario: ${scenarioId}`);
  return scenario.annualInfectionProportion;
}

/**
 * Shows infection rate given the implementation percentage
 */
export function infectionUnderAirCleaningImplementation({
  scenarioId,
  implementation = 1,
  baselineInfectionProportion = BASELINE_INFECTION_PROPORTION,
}: {
  scenarioId: keyof typeof AIR_CLEANING_SCENARIOS;
  implementation: number;
  baselineInfectionProportion: number;
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

/**
 * long covid disease model parameters
 */
export const DEFAULT_LONG_COVID_PARAMETERS = Object.freeze({
  initialState: Object.freeze({ H: 0.956, S1: 0.031, S2: 0.013 }),
  // H => S1: health person develops Long COVID
  baselineOnsetRate: 0.025,
  // S1 => H
  recoveryRate: 0.1,
  // S1 => S2 (sick to sicker)
  progressionRate: 0.1,
  // S2 => S1 (sicker to sick)
  improvementRate: 0.1,
  mortalityHazardRatioS1: 1.001,
  mortalityHazardRatioS2: 1.005,
  // GBD-style disability weights:
  // a year spent in S1 counts as 0.9 of a healthy year
  disabilityWeightS1: 0.1,
  disabilityWeightS2: 0.4,
});

/**
 * long covid disease model options
 */
export const DEFAULT_LONG_COVID_OPTIONS = {
  horizonYears: 5,
  annualInfectionProportion: BASELINE_INFECTION_PROPORTION,
  scaleOnsetByInfection: true,
  stablePopulation: true,
  stableReplacement: "H",
  backgroundMortalityRate: ADULT_WEIGHTED_BACKGROUND_MORTALITY,
  remainingLifeExpectancy: ADULT_WEIGHTED_REMAINING_LIFE_EXPECTANCY,
  discountRate: 0.001,
  populationSize: 1000,
};

type LongCovidInitialState = {
  H: number;
  S1: number;
  S2: number;
};

type LongCovidParameters = {
  initialState: LongCovidInitialState;
  baselineOnsetRate: number;
  recoveryRate: number;
  progressionRate: number;
  improvementRate: number;
  mortalityHazardRatioS1: number;
  mortalityHazardRatioS2: number;
  disabilityWeightS1: number;
  disabilityWeightS2: number;
};

type LongCovidParametersOverride = {
  initialState?: {
    H?: number;
    S1?: number;
    S2?: number;
  };
};

/**
 * Parameters for an acute covid infection
 */
export const DEFAULT_ACUTE_COVID_PARAMETERS = Object.freeze({
  // illness duration * disability weight
  durationWeightedDisability: 0.00888944,
  caseFatalityRate: 0.0005760242424,
});

/**
 * How pre exposure prophylaxis affects infection proportion
 */
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

/**
 * H: healthy
 * S1: sick
 * S2: sicker
 * DOC = died of other cause
 * DS = died from the disease
 */
const STATE_INDEX = Object.freeze({ H: 0, S1: 1, S2: 2, DOC: 3, DS: 4 });
const PADE_COEFFICIENTS = [
  64764752532480000, 32382376266240000, 7771770303897600, 1187353796428800,
  129060195264000, 10559470521600, 670442572800, 33522128640, 1323241920,
  40840800, 960960, 16380, 182, 1,
];

function assertFiniteNonnegative(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, nonnegative number.`);
  }
}

function assertUnitInterval(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1.`);
  }
}

function zeros(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function identity(size: number) {
  const result = zeros(size, size);
  for (let i = 0; i < size; i += 1) result[i][i] = 1;
  return result;
}

function add(a: number[][], b: number[][]) {
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

function subtract(a: number[][], b: number[][]) {
  return a.map((row, i) => row.map((value, j) => value - b[i][j]));
}

function scale(a: number[][], scalar: number) {
  return a.map((row) => row.map((value) => value * scalar));
}

function multiply(a: number[][], b: number[][]) {
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

function multiplyRowVector(vector: number[], matrix: number[][]) {
  return matrix[0].map((_, column) =>
    vector.reduce((sum, value, row) => sum + value * matrix[row][column], 0),
  );
}

function oneNorm(matrix: number[][]) {
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

/**
 * Solve A * X = B using Gaussian elimination with partial pivoting.
 */
function solve(a: number[][], b: number[][]) {
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

/**
 * Scaling-and-squaring matrix exponential using the order-13 Padé
 * approximation described by Higham. This replaces R's expm::expm(Q).
 */
export function matrixExponential(matrix: number[][]) {
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

function discountedLifeExpectancy(
  lifeExpectancy: number,
  discountRate: number,
) {
  if (discountRate === 0) return lifeExpectancy;
  return -Math.expm1(-discountRate * lifeExpectancy) / discountRate;
}

function transitionRateMatrix(
  parameters: LongCovidParameters,
  backgroundMortalityRate: number,
) {
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

function validateLongCovidInputs(
  parameters: LongCovidParameters,
  options: LongCovidOptions,
) {
  const initialValues = Object.values(parameters.initialState);
  initialValues.forEach((value, i) =>
    assertUnitInterval(value, `initialState[${i}]`),
  );
  const total = initialValues.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-10) {
    throw new RangeError("Initial H, S1, and S2 proportions must sum to 1.");
  }
  (
    [
      "baselineOnsetRate",
      "recoveryRate",
      "progressionRate",
      "improvementRate",
      "mortalityHazardRatioS1",
      "mortalityHazardRatioS2",
    ] as const
  ).forEach((name) => assertFiniteNonnegative(parameters[name], name));
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

type LongCovidOptions = {
  horizonYears: number;
  annualInfectionProportion: number;
  scaleOnsetByInfection: boolean;
  stablePopulation: boolean;
  stableReplacement: "H";
  backgroundMortalityRate: number;
  remainingLifeExpectancy: number;
  discountRate: number;
  populationSize: number;
};

type LongCovidOptionsOverride = Partial<
  Omit<LongCovidOptions, "stableReplacement">
>;

interface RunLongCovidInputs {
  userParameters?: LongCovidParametersOverride;
  userOptions?: LongCovidOptionsOverride;
}

export function runLongCovid({
  userParameters = {},
  userOptions,
}: RunLongCovidInputs = {}) {
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
    options: options,
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

export interface AcuteCovidInput {
  userParameters?: {
    durationWeightedDisability?: number;
    caseFatalityRate?: number;
  };
  userOptions?: {
    horizonYears?: number;
    annualInfectionProportion?: number;
    remainingLifeExpectancy?: number;
    populationSize?: number;
  };
}
export function runAcuteCovid({
  userParameters = {},
  userOptions = {},
}: AcuteCovidInput = {}) {
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

// PASC uses the same adult age distribution, background hazards, and remaining
// life expectancy as the reviewed R implementation. The six component models
// intentionally remain separate because their evidence supports different
// onset-age and mortality structures.
export const PASC_STATUS = "evidence_reviewed";
export const PASC_COMPONENT_RANGES = Object.freeze({
  heartFailure: Object.freeze({
    lower: 71.9661030078021,
    upper: 105.871486196926,
  }),
  stroke: Object.freeze({ lower: 21.01, upper: 36.11 }),
  pulmonaryEmbolism: Object.freeze({
    lower: 6.7944611498667,
    upper: 9.24828878284628,
  }),
  dementia: Object.freeze({ lower: 0, upper: 8.95179034862977 }),
  diabetes: Object.freeze({ lower: 0.642218075566604, upper: 2.1092956456018 }),
  myocardialInfarction: Object.freeze({
    lower: 1.08815051316623,
    upper: 1.79148660150277,
  }),
});

const PASC_AGE_STRATA = Object.freeze([
  {
    age: 18.5,
    share: 0.03382868192,
    bg: 0.0007029428344555015,
    le: 70.595262304,
  },
  { age: 20, share: 0.01656572424, bg: 0.000817389785998002, le: 69.10756792 },
  {
    age: 21,
    share: 0.01631022768,
    bg: 0.0008992415994898812,
    le: 68.115914398,
  },
  { age: 23, share: 0.05033542382, bg: 0.00103104104957665, le: 66.132607354 },
  { age: 27, share: 0.0835534501, bg: 0.001243597194584834, le: 62.168091026 },
  { age: 32, share: 0.08935662871, bg: 0.001694411040873463, le: 57.218811716 },
  { age: 37, share: 0.08704135768, bg: 0.002075937393726068, le: 52.278525428 },
  { age: 42, share: 0.08496476693, bg: 0.002681782425590334, le: 47.363764094 },
  { age: 47, share: 0.07615866908, bg: 0.003361762150743718, le: 42.51388749 },
  { age: 52, share: 0.07663206607, bg: 0.004763473426704314, le: 37.746795102 },
  { age: 57, share: 0.0747012151, bg: 0.007131793335618771, le: 33.050303858 },
  { age: 60.5, share: 0.032589963, bg: 0.009610046034392824, le: 29.796183932 },
  { age: 63, share: 0.048734719, bg: 0.01147053153749804, le: 27.509912492 },
  {
    age: 65.5,
    share: 0.03001629476,
    bg: 0.01366407356679217,
    le: 25.241625818,
  },
  { age: 68, share: 0.04243209746, bg: 0.01628186243264503, le: 23.045278208 },
  { age: 72, share: 0.06073847624, bg: 0.02177650370395733, le: 19.614325948 },
  { age: 77, share: 0.04477305888, bg: 0.03513333784415339, le: 15.557598722 },
  { age: 82, share: 0.02752620634, bg: 0.06010902370842262, le: 11.9393073596 },
  { age: 87.5, share: 0.02374097299, bg: 0.1126319271859598, le: 8.8039530795 },
]);

function pascOneStateRateMatrix({
  onset,
  recovery,
  background,
  totalMortality,
}: {
  onset: number;
  recovery: number;
  background: number;
  totalMortality: number;
}) {
  const diseaseDeath = Math.max(0, totalMortality - background);
  return [
    [-(background + onset), onset, 0, background, 0],
    [
      recovery,
      -(recovery + background + diseaseDeath),
      0,
      background,
      diseaseDeath,
    ],
    [0, 0, -background, background, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
}

function runPascMarkovStrata({
  annualInfectionProportion,
  horizonYears,
  populationSize,
  discountRate,
  onsetCoefficient,
  eligible = () => true,
  redistribute = false,
  totalMortality,
  excessMortality = null,
  disabilityWeight,
  recoveryRate,
}: {
  annualInfectionProportion: number;
  horizonYears: number;
  populationSize: number;
  discountRate: number;
  onsetCoefficient: number;
  eligible?: (age: number) => boolean;
  redistribute?: boolean;
  totalMortality: number | ((age: number) => number);
  excessMortality?: number | null;
  disabilityWeight: number;
  recoveryRate: number;
}) {
  const eligibleShare = PASC_AGE_STRATA.reduce(
    (sum, row) => sum + (eligible(row.age) ? row.share : 0),
    0,
  );
  const yearly = Array.from({ length: horizonYears }, (_, index) => ({
    year: index + 1,
    yld: 0,
    yll: 0,
    daly: 0,
  }));
  for (const row of PASC_AGE_STRATA) {
    const coefficient = eligible(row.age)
      ? onsetCoefficient / (redistribute ? eligibleShare : 1)
      : 0;
    const onset = annualInfectionProportion * coefficient;
    const mortality =
      excessMortality === null
        ? typeof totalMortality === "function"
          ? totalMortality(row.age)
          : totalMortality
        : row.bg + excessMortality;
    const transition = matrixExponential(
      pascOneStateRateMatrix({
        onset,
        recovery: recoveryRate,
        background: row.bg,
        totalMortality: mortality,
      }),
    );
    const discountedLe = discountedLifeExpectancy(row.le, discountRate);
    let occupancy = [1, 0, 0, 0, 0];
    for (let year = 1; year <= horizonYears; year += 1) {
      const start = [...occupancy];
      const end = multiplyRowVector(start, transition);
      const discount = Math.exp(-discountRate * (year - 0.5));
      const yld = 0.5 * (start[1] + end[1]) * disabilityWeight * discount;
      const yll = (end[4] - start[4]) * discountedLe * discount;
      yearly[year - 1].yld += yld * row.share;
      yearly[year - 1].yll += yll * row.share;
      yearly[year - 1].daly += (yld + yll) * row.share;
      const deaths = end[3] + end[4];
      end[0] += deaths;
      end[3] = 0;
      end[4] = 0;
      occupancy = end;
    }
  }
  return pascTotals(yearly, populationSize);
}

function runPascTunnelStrata({
  annualInfectionProportion,
  horizonYears,
  populationSize,
  discountRate,
  onsetCoefficient,
  eligible = () => true,
  firstYearProbability,
  chronicProbability,
  disabilityWeight,
}: {
  annualInfectionProportion: number;
  horizonYears: number;
  populationSize: number;
  discountRate: number;
  onsetCoefficient: number;
  eligible?: (age: number) => boolean | null;
  firstYearProbability: number | ((age: number) => number);
  chronicProbability: number | ((age: number) => number);
  disabilityWeight: number;
}) {
  const stepsPerYear = 365;
  const dt = 1 / stepsPerYear;
  const yearly = Array.from({ length: horizonYears }, (_, index) => ({
    year: index + 1,
    yld: 0,
    yll: 0,
    daly: 0,
  }));
  for (const row of PASC_AGE_STRATA) {
    const onsetHazard = eligible(row.age)
      ? annualInfectionProportion * onsetCoefficient
      : 0;
    const p1 =
      typeof firstYearProbability === "function"
        ? firstYearProbability(row.age)
        : firstYearProbability;
    const pc =
      typeof chronicProbability === "function"
        ? chronicProbability(row.age)
        : chronicProbability;
    const h1 = -Math.log1p(-p1);
    const hc = -Math.log1p(-pc);
    const recent = Array(stepsPerYear).fill(0);
    let oldest = 0;
    let recentSum = 0;
    let healthy = 1;
    let chronic = 0;
    const recentDeathProbability = 1 - Math.exp(-h1 * dt);
    const recentDiseaseFraction = h1 > 0 ? Math.max(0, (h1 - row.bg) / h1) : 0;
    const chronicAppliedHazard = Math.max(row.bg, hc);
    const chronicDeathProbability = 1 - Math.exp(-chronicAppliedHazard * dt);
    const chronicDiseaseFraction =
      chronicAppliedHazard > 0
        ? Math.max(0, (chronicAppliedHazard - row.bg) / chronicAppliedHazard)
        : 0;
    const recentSurvival365 = Math.exp(-h1);

    for (let step = 0; step < horizonYears * stepsPerYear; step += 1) {
      const yearIndex = Math.floor(step / stepsPerYear);
      const timeStart = step * dt;
      const disabledStart = recentSum + chronic;
      const totalHealthyHazard = onsetHazard + row.bg;
      const leaveHealthy = healthy * (1 - Math.exp(-totalHealthyHazard * dt));
      const newCase =
        totalHealthyHazard > 0
          ? (leaveHealthy * onsetHazard) / totalHealthyHazard
          : 0;
      const healthyBackgroundDeaths = leaveHealthy - newCase;

      const recentTotalDeaths = recentSum * recentDeathProbability;
      const recentDiseaseDeaths = recentTotalDeaths * recentDiseaseFraction;
      const recentBackgroundDeaths = recentTotalDeaths - recentDiseaseDeaths;
      const exitingRecent = recent[oldest] * recentSurvival365;
      recentSum =
        recentSum * (1 - recentDeathProbability) - exitingRecent + newCase;
      recent[oldest] = newCase;
      oldest = (oldest + 1) % stepsPerYear;

      const chronicDeaths = chronic * chronicDeathProbability;
      const chronicDiseaseDeaths = chronicDeaths * chronicDiseaseFraction;
      const chronicBackgroundDeaths = chronicDeaths - chronicDiseaseDeaths;
      chronic = chronic - chronicDeaths + exitingRecent;
      healthy -= leaveHealthy;
      const diseaseDeaths = recentDiseaseDeaths + chronicDiseaseDeaths;
      const backgroundDeaths =
        healthyBackgroundDeaths +
        recentBackgroundDeaths +
        chronicBackgroundDeaths;
      healthy += diseaseDeaths + backgroundDeaths;

      const disabledEnd = recentSum + chronic;
      const discount = 1 / (1 + discountRate) ** (timeStart + dt / 2);
      const yld =
        ((disabledStart + disabledEnd) / 2) * disabilityWeight * dt * discount;
      const yll = diseaseDeaths * row.le * discount;
      yearly[yearIndex].yld += yld * row.share;
      yearly[yearIndex].yll += yll * row.share;
      yearly[yearIndex].daly += (yld + yll) * row.share;
    }
  }
  return pascTotals(yearly, populationSize);
}

function pascDementiaMortality(age: number) {
  const evidence = [
    [60, 64, 0.117, 0.175, 0.255, 0.343],
    [65, 69, 0.141, 0.221, 0.342, 0.456],
    [70, 74, 0.192, 0.266, 0.442, 0.536],
    [75, 79, 0.218, 0.333, 0.487, 0.626],
    [80, 84, 0.287, 0.415, 0.572, 0.7],
    [85, 89, 0.359, 0.471, 0.659, 0.744],
    [90, 94, 0.462, 0.59, 0.762, 0.813],
    [95, Infinity, 0.541, 0.656, 0.796, 0.823],
  ];
  const lookup = Math.max(age, 60);
  const row = evidence.find(([min, max]) => lookup >= min && lookup <= max);
  if (!row) throw new Error("row not found");
  const oneYear = 0.539 * row[2] + 0.461 * row[3];
  const fiveYear = 0.539 * row[4] + 0.461 * row[5];
  return { oneYear, chronic: 1 - ((1 - fiveYear) / (1 - oneYear)) ** 0.25 };
}

function pascTotals(
  yearly: {
    year: number;
    yld: number;
    yll: number;
    daly: number;
  }[],
  populationSize: number,
) {
  const yld = yearly.reduce((sum, row) => sum + row.yld, 0);
  const yll = yearly.reduce((sum, row) => sum + row.yll, 0);
  const daly = yld + yll;
  return {
    yearly,
    totals: {
      yld,
      yll,
      daly,
      dalysPer1000: daly * 1000,
      dalysTotalPopulation: daly * populationSize,
    },
  };
}

interface RunPascInput {
  userOptions?: {
    horizonYears?: number;
    annualInfectionProportion?: number;
    populationSize?: number;
    discountRate?: number;
  };
}

export function runPasc({ userOptions }: RunPascInput = {}) {
  const options = {
    horizonYears: 5,
    annualInfectionProportion: BASELINE_INFECTION_PROPORTION,
    populationSize: 1000,
    discountRate: 0.001,
    ...userOptions,
  };
  assertUnitInterval(
    options.annualInfectionProportion,
    "annualInfectionProportion",
  );
  if (options.horizonYears !== 5) {
    throw new RangeError(
      "The PASC implementation is currently validated for five years only.",
    );
  }
  const adultBackground = PASC_AGE_STRATA.reduce(
    (sum, row) => sum + row.share * row.bg,
    0,
  );
  const heartFailure = runPascTunnelStrata({
    ...options,
    onsetCoefficient: 0.00546,
    firstYearProbability: 0.24,
    chronicProbability: 1 - (0.567 / 0.76) ** 0.25,
    disabilityWeight: 0.04 * 0.24 + 0.07 * 0.17 + 0.18 * 0.49,
  });
  const stroke = runPascMarkovStrata({
    ...options,
    onsetCoefficient: 0.00115,
    totalMortality: -Math.log1p(-0.41),
    disabilityWeight: 0.02 * 0.198 + 0.07 * 0.303 + 0.55 * 0.499,
    recoveryRate: 0.4,
  });
  const pulmonaryEmbolism = runPascMarkovStrata({
    ...options,
    onsetCoefficient: 0.00332,
    eligible: (age) => age >= 40,
    redistribute: true,
    totalMortality: 0,
    excessMortality: -Math.log1p(-0.075) + Math.log1p(-0.016),
    disabilityWeight: 0.03,
    recoveryRate: 1,
  });
  const dementia = runPascTunnelStrata({
    ...options,
    onsetCoefficient: (570 * 0.41) / 100000,
    eligible: (age) => age >= 65,
    firstYearProbability: (age) => pascDementiaMortality(age).oneYear,
    chronicProbability: (age) => pascDementiaMortality(age).chronic,
    disabilityWeight: 0.069 * 0.504 + 0.377 * 0.303 + 0.449 * 0.193,
  });
  const diabetes = runPascMarkovStrata({
    ...options,
    onsetCoefficient: 1 / 406,
    eligible: (age) => age >= 60,
    redistribute: true,
    totalMortality: 0,
    excessMortality: Math.max(0, 0.0152 - adultBackground),
    disabilityWeight: 0.0778,
    recoveryRate: 0,
  });
  const myocardialInfarction = runPascMarkovStrata({
    ...options,
    onsetCoefficient: (217 * 0.1386) / 100000,
    eligible: (age) => age >= 40,
    redistribute: true,
    totalMortality: (age) =>
      -Math.log1p(-(age < 50 ? 0.048 : age < 65 ? 0.142 : 0.24)),
    disabilityWeight: 0.01,
    recoveryRate: 1,
  });
  const components = {
    heartFailure,
    stroke,
    pulmonaryEmbolism,
    dementia,
    diabetes,
    myocardialInfarction,
  };
  const yearly = Array.from({ length: options.horizonYears }, (_, index) => ({
    year: index + 1,
    yld: 0,
    yll: 0,
    daly: 0,
  }));
  for (const component of Object.values(components)) {
    component.yearly.forEach((row, index) => {
      yearly[index].yld += row.yld;
      yearly[index].yll += row.yll;
      yearly[index].daly += row.daly;
    });
  }
  return {
    condition: "pasc",
    label: "Post-acute sequelae of COVID-19",
    status: PASC_STATUS,
    options,
    components,
    componentRanges: PASC_COMPONENT_RANGES,
    ...pascTotals(yearly, options.populationSize),
  };
}
