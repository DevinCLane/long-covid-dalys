// Succinct definitions from the About tab. Describe the intervention without
// repeating default efficacy values, since those assumptions can be adjusted.
const progressionDescription =
  "Hypothetical treatment that reduces progression from some to significant activity limitations in Long COVID.";
const symptomDescription =
  "Hypothetical treatment that reduces the Long COVID-associated disability burden.";

export const scenarioDescriptions: Record<string, string> = {
  baseline:
    "No public health action to mitigate COVID-19 infections at the population level.",
  hepa_most_public:
    "HEPA filtration captures very small airborne particles in some shared indoor spaces, such as dining halls and waiting rooms.",
  hepa_schools_and_daycares:
    "HEPA filtration captures very small airborne particles in all indoor spaces in schools and daycares.",
  hepa_all_public:
    "HEPA filtration captures very small airborne particles in all indoor public spaces.",
  far_uvc_most_public:
    "Germicidal far UV-C irradiation in some shared indoor spaces, such as dining halls and waiting rooms.",
  far_uvc_schools_and_daycares:
    "Germicidal far UV-C irradiation in all indoor spaces in schools and daycares.",
  far_uvc_all_public:
    "Germicidal far UV-C irradiation in all indoor public spaces.",
  preexposure_prophylaxis:
    "Hypothetical medication used before exposure to reduce COVID-19 infections.",
  postexposure_prophylaxis:
    "Hypothetical medication used after exposure to reduce COVID-19 infections.",
  long_covid_progression_reduction: progressionDescription,
  long_covid_progression_reduction_substantial: progressionDescription,
  long_covid_disability_reduction: symptomDescription,
  long_covid_disability_reduction_substantial: symptomDescription,
};

export const outcomeDescriptions: Record<string, string> = {
  "Acute COVID":
    "Short-term disability and mortality from acute COVID-19 infections.",
  "Long COVID":
    "Ongoing symptoms with some or significant activity limitations following COVID-19 infection.",
  "Other sequelae":
    "New-onset conditions following COVID-19: heart attack, heart failure, dementia, stroke, pulmonary embolism, and diabetes.",
  Total:
    "Combined disability and mortality from acute COVID, Long COVID, and other post-acute sequelae.",
};
