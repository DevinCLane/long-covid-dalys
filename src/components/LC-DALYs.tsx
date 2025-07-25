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
import { InterventionArea } from "@/components/intervention-area";
import { CumulativeComparativeSwitcher } from "./cumulative-comparative-switcher";

/**
 * Defines categories into which multiple interventions are grouped.
 */
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

/**
 * List of interventions to display. Add or remove interventions here.
 */
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.05;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.2;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.3;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.15;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.1;
    },
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
    reductionFn: function (sliderValue) {
      return (sliderValue / this.sliderMax) * 0.2;
    },
  },
];

/**
 * Groups interventions by their category for display purposes.
 */
const groupedInterventions = INTERVENTIONS.reduce(
  (acc, intervention) => {
    if (!acc[intervention.group]) acc[intervention.group] = [];
    acc[intervention.group].push(intervention);
    return acc;
  },
  {} as Record<string, Intervention[]>,
);

interface ChartDataItem {
  date: string;
  dalys: number;
  [key: string]: number | string;
}

/**
 * Generates the baseline chart data for Long COVID DALYs.
 * Starts with 17 million cases and reduces by 2% each year.
 * Each case contributes 80 DALYs per 1,000 people.
 */
const generateChartDataItems = () => {
  const data: ChartDataItem[] = [];
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

const chartDataItems = generateChartDataItems();

/**
 * Calculates the reduced DALYs based on interventions applied, either cumulatively or comparing between interventions.
 * @param item - The baseline chart data (no intervention).
 * @param interventionSliderValues - Object containing slider values for each intervention.
 * @param isComparativeMode - Boolean indicating if the chart is in comparative mode.
 * @returns The modified chart data with reduced DALYs.
 */
const calculateInterventionDALYs = (
  item: ChartDataItem,
  interventionSliderValues: Record<string, number>,
  isComparativeMode: boolean,
): ChartDataItem => {
  const modifiedDataItem: ChartDataItem = {
    ...item,
  };

  if (isComparativeMode) {
    // In comparative mode, we calculate each intervention's DALYs separately
    for (const intervention of INTERVENTIONS) {
      const sliderValue = interventionSliderValues[intervention.key];
      if (sliderValue > 0) {
        modifiedDataItem[intervention.key] = Math.round(
          item.dalys * (1 - intervention.reductionFn(sliderValue)),
        );
      }
    }
  } else {
    // In cumulative mode, we calculate the cumulative effect of all interventions
    let totalReductionFactor = 0;
    for (const intervention of INTERVENTIONS) {
      const sliderValue = interventionSliderValues[intervention.key];
      totalReductionFactor += intervention.reductionFn(sliderValue);
    }
    if (totalReductionFactor > 0) {
      modifiedDataItem.interventionDalys = Math.round(
        item.dalys * (1 - totalReductionFactor),
      );
    }
  }
  return modifiedDataItem;
};

export function LCDALYs() {
  const [timeRange, setTimeRange] = React.useState("5y");
  const [isComparativeMode, setIsComparativeMode] = React.useState(false);

  const initialInterventionValues = Object.fromEntries(
    INTERVENTIONS.map((intervention) => [
      intervention.key,
      intervention.defaultValue,
    ]),
  );

  const [interventionSliderValues, setInterventionSliderValues] =
    React.useState(initialInterventionValues);

  // loop through interventions and create a chart config for each
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      dalys: {
        label: "Baseline DALYs (no intervention)",
        color: "hsl(var(--chart-1))",
      },
    };
    if (isComparativeMode) {
      INTERVENTIONS.forEach((intervention, index) => {
        if (interventionSliderValues[intervention.key] > 0) {
          config[intervention.key] = {
            label: intervention.sliderLabel,
            color: `hsl(var(--chart-${index + 3}))`,
          };
        }
      });
    } else {
      config.interventionDalys = {
        label: "Intervention DALYs",
        color: "hsl(var(--chart-2))",
      };
    }

    return config;
  }, [isComparativeMode, interventionSliderValues]);

  const handleSliderValueChange = (id: string, value: number[]) => {
    setInterventionSliderValues((prev) => ({
      ...prev,
      [id]: value[0],
    }));
  };

  const durationToEndDate: Record<string, Date> = {
    "5y": new Date("2029-01-01"),
    "10y": new Date("2034-01-01"),
  };

  const filteredData = chartDataItems
    .map((chartDataItem) =>
      calculateInterventionDALYs(
        chartDataItem,
        interventionSliderValues,
        isComparativeMode,
      ),
    )
    .filter((item) => {
      const date = new Date(item.date);
      const startDate = new Date("2025-01-01");
      const endDate = durationToEndDate[timeRange];
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
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full md:h-[600px]"
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
              y={window.innerWidth < 640 ? "50%" : "50%"}
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
            {Object.entries(chartConfig).map(([key]) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={`var(--color-${key})`}
              />
            ))}
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 space-y-8">
          <div className="flex items-center justify-center gap-4">
            <CumulativeComparativeSwitcher
              isComparativeMode={isComparativeMode}
              setIsComparativeMode={setIsComparativeMode}
            />
            {/* <Checkbox
              id="comparative-mode"
              checked={isComparativeMode}
              onCheckedChange={(checked) =>
                setIsComparativeMode(checked as boolean)
              }
            />
            <label htmlFor="comparative-mode">Compare Interventions</label> */}
          </div>
          {Object.entries(groupedInterventions).map(
            ([group, groupInterventions]) => (
              <div key={group}>
                <h3 className="mb-2 text-lg font-semibold">
                  {GROUP_LABELS[group]}
                </h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                  {groupInterventions.map((intervention) => (
                    <InterventionArea
                      key={intervention.key}
                      id={intervention.key}
                      ariaLabel={intervention.ariaLabel}
                      sliderLabel={intervention.sliderLabel}
                      sliderSubLabel={intervention.sliderSubLabel}
                      sliderMin={intervention.sliderMin}
                      sliderMax={intervention.sliderMax}
                      sliderStep={intervention.sliderStep}
                      sliderInitialValue={intervention.defaultValue}
                      sliderDefaultValue={intervention.defaultValue}
                      sliderDisabled={false}
                      onSliderChange={(value) =>
                        handleSliderValueChange(intervention.key, value)
                      }
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
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
