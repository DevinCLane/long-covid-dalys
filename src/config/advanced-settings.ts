export interface AdvancedSetting {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string; // Optional unit to display (e.g., "%", "DALYs")
}

/**
 * Advanced settings that allow users to adjust model assumptions.
 * These values modify the base scenario calculations.
 */
export const ADVANCED_SETTINGS: AdvancedSetting[] = [
  {
    key: "annualInfectionRate",
    label: "Annual infection rate",
    description:
      "Percentage of the population infected with SARS-CoV-2 each year",
    min: 10,
    max: 50,
    step: 1,
    defaultValue: 29,
    unit: "%",
  },
  {
    key: "longCovidConversionRate",
    label: "Long COVID conversion rate",
    description:
      "Fraction of COVID-19 infections that convert into syndromic Long COVID",
    min: 5,
    max: 50,
    step: 0.5,
    defaultValue: 10, // Estimated default, adjust based on research
    unit: "%",
  },
  {
    key: "dalyWeightLessSevere",
    label: "DALY weight (less severe Long COVID)",
    description: "DALYs lost per year for people with less severe Long COVID",
    min: 0.05,
    max: 0.5,
    step: 0.05,
    defaultValue: 0.1,
    unit: "DALYs/year",
  },
  {
    key: "dalyWeightModerate",
    label: "DALY weight (moderate Long COVID)",
    description:
      "DALYs lost per year for people with moderately severe Long COVID",
    min: 0.2,
    max: 1.0,
    step: 0.1,
    defaultValue: 0.4,
    unit: "DALYs/year",
  },
  {
    key: "indoorAirTransmissionPercent",
    label: "Infections via indoor air transmission",
    description:
      "Percentage of COVID-19 infections that occur via extended exposure to circulated indoor air (vs. close, brief contact)",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 60, // Estimated default, adjust based on research
    unit: "%",
  },
  {
    key: "hepaEffectivenessMultiplier",
    label: "HEPA effectiveness multiplier",
    description:
      "Multiplier to adjust HEPA filter effectiveness (1.0 = base effectiveness from research)",
    min: 0.5,
    max: 1.5,
    step: 0.1,
    defaultValue: 1.0,
  },
  {
    key: "farUvcEffectivenessMultiplier",
    label: "Far UVC effectiveness multiplier",
    description:
      "Multiplier to adjust Far UVC effectiveness (1.0 = base effectiveness from research)",
    min: 0.5,
    max: 1.5,
    step: 0.1,
    defaultValue: 1.0,
  },
];

/**
 * Get default values for all advanced settings
 */
export const getDefaultAdvancedSettings = (): Record<string, number> => {
  return ADVANCED_SETTINGS.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.defaultValue;
      return acc;
    },
    {} as Record<string, number>,
  );
};

/**
 * Get an advanced setting by its key
 */
export const getAdvancedSettingByKey = (
  key: string,
): AdvancedSetting | undefined => {
  return ADVANCED_SETTINGS.find((setting) => setting.key === key);
};
