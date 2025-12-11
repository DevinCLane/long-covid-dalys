import DALYs from "@/data/DALYs.json";

interface Scenario {
  id: string;
  label: string;
  sublabel?: string;
  isChecked?: boolean;
}

// to do: read the data from the `DALYs.json`'
// grab the id, the dalys, and the percentage of population infected

export const SCENARIOS: Scenario[] = [
  {
    id: Object.keys(DALYs[1])[1],
    label: "Long Covid Baseline",
    sublabel:
      "258 DALYs per 1,000 people over 10 years. No air cleaning intervention. ~29% of population infected annually.",
    isChecked: true,
  },
  {
    id: Object.keys(DALYs[1])[2],
    label: "HEPA in most common spaces indoor air (8% fewer cases)",
    sublabel:
      "246 DALYs per 1,000 people over 10 years. Incomplete implementation scenarios: HEPA in most common spaces indoor air (8% fewer cases). ~26% of population infected annually.",
    isChecked: false,
  },
  {
    id: Object.keys(DALYs[1])[3],
    label: " HEPA schools and daycares",
    sublabel:
      "233 DALYs per 1,000 people over 10 years. HEPA filters implemented in all K-12 schools, preschools, and daycare settings. ~24% of population infected annually.",
    isChecked: false,
  },
  {
    id: Object.keys(DALYs[1])[4],
    label: "HEPA all public indoor air",
    sublabel:
      "162 DALYs per 1,000 people over 10 years. HEPA filters implemented in all public indoor spaces. ~11% of population infected annually.",
    isChecked: false,
  },
  {
    id: Object.keys(DALYs[1])[5],
    label: "Far UVC in most common spaces indoor air (12% fewer cases)",
    sublabel:
      "240 DALYs per 1,000 people over 10 years. Far UVC in most common spaces indoor air (12% fewer cases). ~25% of population infected annually.",
    isChecked: false,
  },
  {
    id: Object.keys(DALYs[1])[6],
    label: "Far UVC schools and daycares",
    sublabel:
      "226 DALYs per 1,000 people over 10 years. Far UVC in schools and daycares. ~23% of population infected annually.",
    isChecked: false,
  },
  {
    id: Object.keys(DALYs[1])[7],
    label: "Far UVC all public indoor air",
    sublabel:
      "131 DALYs per 1,000 people over 10 years. Far UVC in all public indoor spaces. ~6% of population infected annually.",
    isChecked: false,
  },
];
