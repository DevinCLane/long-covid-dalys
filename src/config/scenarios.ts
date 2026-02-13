import DALYs from "@/data/DALYs.json";

export interface Scenario {
  id: string;
  DALYs: number;
  infected: number;
  group: string;
  groupLabel?: string;
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

/**
 * map the single word, lowercase group name to the text to display for the group
 */
export const groupLabels: Record<string, string> = {
  baseline: "Baseline",
  hepa: "HEPA Filters",
  uvc: "Far UVC Light",
};

/**
 * Each scenario for which we are displays DALYs
 */
export const SCENARIOS: Scenario[] = [
  {
    id: dalysEntries[1][0],
    DALYs: dalysEntries[1][1],
    infected: 29,
    group: "baseline",
    label: "Long Covid Baseline",
    sublabel: "No air cleaning intervention.",
    checked: true,
  },
  {
    id: dalysEntries[3][0],
    DALYs: dalysEntries[3][1],
    infected: 24,
    group: "hepa",
    label: "HEPA schools and daycares",
    sublabel:
      "HEPA filters implemented in all K-12 schools, preschools, and daycare settings.",
    checked: false,
  },
  {
    id: dalysEntries[4][0],
    DALYs: dalysEntries[4][1],
    infected: 11,
    group: "hepa",
    label: "HEPA all public indoor air",
    sublabel: "HEPA filters implemented in all public indoor spaces.",
    checked: false,
  },
  {
    id: dalysEntries[6][0],
    DALYs: dalysEntries[6][1],
    infected: 23,
    group: "uvc",
    label: "Far UVC schools and daycares",
    sublabel: "Far UVC in schools and daycares.",
    checked: false,
  },
  {
    id: dalysEntries[7][0],
    DALYs: dalysEntries[7][1],
    infected: 6,
    group: "uvc",
    label: "Far UVC all public indoor air",
    sublabel: "Far UVC in all public indoor spaces.",
    checked: false,
  },
];

export const groupedScenarios = SCENARIOS.reduce(
  (acc, scenario) => {
    if (!acc[scenario.group]) acc[scenario.group] = [];
    acc[scenario.group].push(scenario);
    return acc;
  },
  {} as Record<string, Scenario[]>,
);
console.log(groupedScenarios);
