import DALYs from "@/data/DALYs.json";

export interface Scenario {
  id: string;
  DALYs: number;
  infected: number;
  group: string;
  label: string;
  sublabel?: string;
  checked: boolean;
}

// 10th year is the final year of the model (in the 0 indexed list, 9 is the 10th item)
const FINAL_YEAR = DALYs.length - 1;

export const getDefaultSelectedScenarios = (): Set<string> => {
  return new Set(
    SCENARIOS.filter((scenario) => scenario.checked).map(
      (scenario) => scenario.id,
    ),
  );
};

const dalysEntries = Object.entries(DALYs[FINAL_YEAR]);

// to do: read the data from the `DALYs.json`'
// grab the id, the dalys, and the percentage of population infected

/**
 * Each scenario for which we are displays DALYs
 */
export const SCENARIOS: Scenario[] = [
  {
    // to do: each one of these (DALYs[1])[1] should be (DALYs[9])[1], (DALYs[9])[2], etc to represent the 10th year in the model
    id: dalysEntries[1][0],
    DALYs: dalysEntries[1][1],
    infected: 29,
    group: "baseline",
    label: "Long Covid Baseline",
    sublabel: "No air cleaning intervention.",
    checked: true,
  },
  {
    id: dalysEntries[2][0],
    DALYs: dalysEntries[2][1],
    infected: 26,
    group: "HEPA",
    label: "HEPA in most common indoor spaces",
    sublabel:
      "Incomplete implementation scenario: HEPA in most common spaces indoor air (8% fewer cases).",
    checked: false,
  },
  {
    id: dalysEntries[3][0],
    DALYs: dalysEntries[3][1],
    infected: 24,
    group: "HEPA",
    label: " HEPA schools and daycares",
    sublabel:
      "HEPA filters implemented in all K-12 schools, preschools, and daycare settings.",
    checked: false,
  },
  {
    id: dalysEntries[4][0],
    DALYs: dalysEntries[4][1],
    infected: 11,
    group: "HEPA",
    label: "HEPA all public indoor air",
    sublabel: "HEPA filters implemented in all public indoor spaces.",
    checked: false,
  },
  {
    id: dalysEntries[5][0],
    DALYs: dalysEntries[5][1],
    infected: 25,
    group: "UVC",
    label: "Far UVC in most common indoor spaces",
    sublabel: "Far UVC in most common spaces indoor air (12% fewer cases).",
    checked: false,
  },
  {
    id: dalysEntries[6][0],
    DALYs: dalysEntries[6][1],
    infected: 23,
    group: "UVC",
    label: "Far UVC schools and daycares",
    sublabel: "Far UVC in schools and daycares.",
    checked: false,
  },
  {
    id: dalysEntries[7][0],
    DALYs: dalysEntries[7][1],
    infected: 6,
    group: "UVC",
    label: "Far UVC all public indoor air",
    sublabel: "Far UVC in all public indoor spaces.",
    checked: false,
  },
];
