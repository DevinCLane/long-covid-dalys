import DALYs from "@/data/DALYs.json";

export interface Scenario {
  id: string;
  DALYs: number;
  infected: number;
  label: string;
  sublabel?: string;
  checked: boolean;
}

// 10th year is the final year of the model (in the 0 indexed list, 9 is the 10th item)
const FINAL_YEAR = 9;

export const getDefaultSelectedScenarios = (): Set<string> => {
  return new Set(
    SCENARIOS.filter((scenario) => scenario.checked).map(
      (scenario) => scenario.id,
    ),
  );
};

// to do: read the data from the `DALYs.json`'
// grab the id, the dalys, and the percentage of population infected

/**
 * Each scenario for which we are displays DALYs
 */
export const SCENARIOS: Scenario[] = [
  {
    // to do: each one of these (DALYs[1])[1] should be (DALYs[9])[1], (DALYs[9])[2], etc to represent the 10th year in the model
    id: Object.keys(DALYs[FINAL_YEAR])[1],
    DALYs: Object.values(DALYs[FINAL_YEAR])[1],
    infected: 29,
    label: "Long Covid Baseline",
    sublabel: "No air cleaning intervention.",
    checked: true,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[2],
    DALYs: Object.values(DALYs[FINAL_YEAR])[2],
    infected: 26,
    label: "HEPA in most common indoor spaces",
    sublabel:
      "Incomplete implementation scenario: HEPA in most common spaces indoor air (8% fewer cases).",
    checked: false,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[3],
    DALYs: Object.values(DALYs[FINAL_YEAR])[3],
    infected: 24,
    label: " HEPA schools and daycares",
    sublabel:
      "HEPA filters implemented in all K-12 schools, preschools, and daycare settings.",
    checked: false,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[4],
    DALYs: Object.values(DALYs[FINAL_YEAR])[4],
    infected: 11,
    label: "HEPA all public indoor air",
    sublabel: "HEPA filters implemented in all public indoor spaces.",
    checked: false,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[5],
    DALYs: Object.values(DALYs[FINAL_YEAR])[5],
    infected: 25,
    label: "Far UVC in most common indoor spaces",
    sublabel: "Far UVC in most common spaces indoor air (12% fewer cases).",
    checked: false,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[6],
    DALYs: Object.values(DALYs[FINAL_YEAR])[6],
    infected: 23,
    label: "Far UVC schools and daycares",
    sublabel: "Far UVC in schools and daycares.",
    checked: false,
  },
  {
    id: Object.keys(DALYs[FINAL_YEAR])[7],
    DALYs: Object.values(DALYs[FINAL_YEAR])[7],
    infected: 6,
    label: "Far UVC all public indoor air",
    sublabel: "Far UVC in all public indoor spaces.",
    checked: false,
  },
];
