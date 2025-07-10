"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { InterventionsSlider } from "@/components/interventions-slider";
import { InterventionArea } from "@/components/intervention-area";

// todo: use the group labels to group interventions in the UI
const GROUP_LABELS: Record<string, string> = {
  air: "Air Quality improvements",
  masking: "Masking",
  vaccination: "Vaccination",
  publicHealth: "Public Health Policies",
  pharma: "Pharmaceutical Interventions",
};

interface Intervention {
  key: string;
  group: keyof typeof GROUP_LABELS;
  ariaLabel: string;
  sliderLabel: string;
  sliderSubLabel: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  defaultValue: number;
  reductionFn: (sliderValue: number) => number;
}

const INTERVENTIONS: Intervention[] = [
  {
    key: "airExchangeRate",
    group: "air",
    ariaLabel: "Air Changes Per Hour (ACH)",
    sliderLabel: "Air Changes Per Hour (ACH)",
    sliderSubLabel: "Percentage of buildings with a minimum of 5 ACH",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "UVC",
    group: "air",
    ariaLabel: "Far germicidal UVC",
    sliderLabel: "Far germicidal UVC",
    sliderSubLabel: "Percentage of buildings with far germicidal UVC",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "masksHealthcare",
    group: "masking",
    ariaLabel: "Masks in Healthcare Settings",
    sliderLabel: "Masking in healthcare facilities",
    sliderSubLabel: "Percentage of healthcare facilities with mask mandates",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "masksGeneral",
    group: "masking",
    ariaLabel: "Masks in General Population",
    sliderLabel: "Masking in general population",
    sliderSubLabel: "Percentage of general population wearing masks",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "sickLeave",
    group: "publicHealth",
    ariaLabel: "Paid Sick Leave",
    sliderLabel: "Paid Sick Leave",
    sliderSubLabel: "Percentage of workers with paid sick leave",
    sliderMin: 0,
    sliderMax: 52,
    sliderStep: 1,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.05,
  },
  {
    key: "testing",
    group: "publicHealth",
    ariaLabel: "Free COVID Tests",
    sliderLabel: "Free COVID tests",
    sliderSubLabel:
      "Percentage of population with free COVID tests available to them",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "vaccinationCurrent",
    group: "vaccination",
    ariaLabel: "Vaccination Coverage: Current Vaccines",
    sliderLabel: "Vaccination Coverage: Current Vaccines",
    sliderSubLabel:
      "Percentage of population with up-to-date vaccination for current variants",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.2,
  },
  {
    key: "vaccinationImproved",
    group: "vaccination",
    ariaLabel:
      "Vaccination Coverage: Improved Vaccines for Long COVID Prevention",
    sliderLabel:
      "Vaccination Coverage: improved vaccine for long COVID prevention",
    sliderSubLabel:
      "Percentage of population with improved vaccine for long COVID prevention",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.3,
  },
  {
    key: "nasalSprays",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Nasal Sprays",
    sliderLabel: "Pharmaceutical intervention: nasal sprays",
    sliderSubLabel:
      "Percentage of population using COVID preventative nasal sprays",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.15,
  },
  {
    key: "paxlovid",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Paxlovid",
    sliderLabel: "Pharmaceutical intervention: Paxlovid",
    sliderSubLabel:
      "Percentage of population taking Paxlovid during acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "metformin",
    group: "pharma",
    ariaLabel: "Pharmaceutical Interventions: Metformin",
    sliderLabel: "Pharmaceutical intervention: Metformin",
    sliderSubLabel:
      "Percentage of population taking Metformin during acute COVID",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.1,
  },
  {
    key: "reduceSymptoms",
    group: "pharma",
    ariaLabel:
      "Pharmaceutical Interventions - Reduction of Long COVID Symptoms",
    sliderLabel:
      "Pharmaceutical intervention: reduction of long covid symptoms",
    sliderSubLabel:
      "Percentage of population taking pharmaceuticals that reduce long covid symptoms",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    defaultValue: 0,
    reductionFn: (sliderValue) => (sliderValue / 100) * 0.2,
  },
];

const generateChartData = () => {
  const data = [];
  let baselineCases = 17000000; // Starting with 17M cases
  const yearlyReduction = 0.98; // 2% reduction per year
  // 80 DALYs per 1k people with LC
  const dalysPer1000People = 80;

  for (let year = 2025; year <= 2125; year++) {
    // convert LC cases to DALYs
    const totalDALYs = (baselineCases * dalysPer1000People) / 1000;
    data.push({
      date: `${year}-01-01`,
      dalys: Math.round(totalDALYs),
    });
    baselineCases *= yearlyReduction; // Reduce by 2% each year
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  dalys: {
    label: "Million DALYs per year",
    color: "hsl(var(--chart-1))",
  },
  interventionDalys: {
    label: "With interventions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const calculateReducedDALYs = (
  baseData: typeof chartData,
  interventions: Record<string, boolean>,
  interventionValues: Record<string, number>,
) => {
  let reductionFactor = 0;
  for (const intervention of INTERVENTIONS) {
    if (interventions[intervention.key]) {
      const sliderValue = interventionValues[intervention.key];
      reductionFactor += intervention.reductionFn(sliderValue);
    }
  }

  return baseData.map((item) => ({
    date: item.date,
    dalys: Math.round(item.dalys * (1 - reductionFactor)),
  }));
};

export function LCDALYs() {
  const [timeRange, setTimeRange] = React.useState("5y");

  const initialInterventions = Object.fromEntries(
    INTERVENTIONS.map((intervention) => [intervention.key, false]),
  );

  const initialInterventionValues = Object.fromEntries(
    INTERVENTIONS.map((intervention) => [
      intervention.key,
      intervention.defaultValue,
    ]),
  );

  const [interventions, setInterventions] =
    React.useState(initialInterventions);

  const [interventionValues, setInterventionValues] = React.useState(
    initialInterventionValues,
  );

  const handleInterventionChange = (id: string, checked: boolean) => {
    setInterventions((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSliderValueChange = (id: string, value: number[]) => {
    setInterventionValues((prev) => ({
      ...prev,
      [id]: value[0],
    }));
  };

  const filteredData = chartData
    .map((baselineItem) => {
      const date = baselineItem.date;
      const interventionDalys = calculateReducedDALYs(
        [baselineItem],
        interventions,
        interventionValues,
      )[0].dalys;

      return {
        date,
        dalys: baselineItem.dalys,
        interventionDalys,
      };
    })
    .filter((item) => {
      const date = new Date(item.date);
      const startDate = new Date("2025-01-01");
      let endDate = new Date("2029-01-01");

      switch (timeRange) {
        case "10y":
          endDate = new Date("2034-01-01");
          break;
        case "25y":
          endDate = new Date("2049-01-01");
          break;
        case "50y":
          endDate = new Date("2074-01-01");
          break;
        case "100y":
          endDate = new Date("2124-01-01");
          break;
      }
      return date >= startDate && date <= endDate;
    });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Long Covid Disease Burden in the United States</CardTitle>
          <CardDescription>
            Showing the total disease burden of long covid as measured in{" "}
            <a
              href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Disability-adjusted life years (DALYs)
            </a>
            . Each DALY represents one year of healthy life lost to illness.
          </CardDescription>
          <CardDescription>
            Based on research showing 80 DALYs per 1,000 long COVID cases
            <sup>1</sup> with an estimated 17M cases of long COVID
            <sup>2</sup> in the US.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-auto rounded-lg bg-card sm:ml-auto"
            aria-label="Select projection range"
          >
            <SelectValue placeholder="5 year projection" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card">
            <SelectItem value="5y" className="rounded-lg">
              5 Year Projection
            </SelectItem>
            <SelectItem value="10y" className="rounded-lg">
              10 Year Projection
            </SelectItem>
            <SelectItem value="25y" className="rounded-lg">
              25 Year Projection
            </SelectItem>
            <SelectItem value="50y" className="rounded-lg">
              50 Year Projection
            </SelectItem>
            <SelectItem value="100y" className="rounded-lg">
              100 Year Projection
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="md:h-[12 00px] aspect-auto h-[1050px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="filldalys" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dalys)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dalys)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillInterventionDalys"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-interventionDalys)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-interventionDalys)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                });
              }}
            />
            <YAxis
              dataKey="dalys"
              axisLine={false}
              width={85}
              tick={{ width: 250 }}
              tickMargin={8}
              // 17M cases * 80 DALYs / 1000
              domain={[0, 1360000]}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}M  `}
              allowDataOverflow={false}
              label={{
                value: "Million DALYs per year",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <text
              className="left-2 text-2xl font-bold tracking-widest opacity-50 lg:text-5xl"
              x={window.innerWidth < 640 ? "60%" : "50%"}
              y={window.innerWidth < 640 ? "15%" : "28%"}
              textAnchor="middle"
            >
              TEST DATA
            </text>

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-card"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="dalys"
              type="natural"
              fill="url(#filldalys)"
              stroke="var(--color-dalys)"
            />
            <Area
              dataKey="interventionDalys"
              type="natural"
              fill="url(#fillInterventionDalys)"
              stroke="var(--color-interventionDalys)"
            />
            <ChartLegend
              content={
                <>
                  <ChartLegendContent />
                  <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                    {INTERVENTIONS.map((intervention) => (
                      <InterventionArea
                        key={intervention.key}
                        id={intervention.key}
                        checked={interventions[intervention.key]}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            intervention.key,
                            checked as boolean,
                          )
                        }
                        ariaLabel={intervention.ariaLabel}
                        sliderLabel={intervention.sliderLabel}
                        sliderSubLabel={intervention.sliderSubLabel}
                        sliderMin={intervention.sliderMin}
                        sliderMax={intervention.sliderMax}
                        sliderStep={intervention.sliderStep}
                        sliderInitialValue={intervention.defaultValue}
                        sliderDefaultValue={intervention.defaultValue}
                        sliderDisabled={!interventions[intervention.key]}
                        onSliderChange={(value) =>
                          handleSliderValueChange(intervention.key, value)
                        }
                      />
                    ))}
                  </div>
                </>
              }
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
          <p className="mb-2">References:</p>
          <ol className="list-inside list-decimal">
            <li>
              <a
                href="https://www.nature.com/articles/s41591-023-02521-2"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Nature Medicine: Long COVID burden and risk factors in 10 UK
                longitudinal studies and electronic health records
              </a>
            </li>
            <li>
              <a
                href="https://www.kff.org/coronavirus-covid-19/issue-brief/as-recommendations-for-isolation-end-how-common-is-long-covid/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                KFF: As Recommendations for Isolation End, How Common is Long
                COVID?
              </a>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
