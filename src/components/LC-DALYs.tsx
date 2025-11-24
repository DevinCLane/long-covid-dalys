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
import { ScenarioSelector } from "@/components/scenario-selector";
import { AdvancedSettingsPanel } from "@/components/advanced-settings-panel";
import { Scenario, getDefaultScenario } from "@/config/scenarios";
import { getDefaultAdvancedSettings } from "@/config/advanced-settings";
import chartDataItems from "@/data/DALYs.json";

interface ChartDataItem {
  date: string;
  dalys: number;
  [key: string]: number | string;
}

/**
 * Calculates the reduced DALYs based on selected scenario and advanced settings.
 * @param item - The baseline chart data (no intervention).
 * @param scenario - The selected scenario with its reduction factor.
 * @param advancedSettings - Advanced settings that adjust the calculations.
 * @returns The modified chart data with reduced DALYs.
 */
const calculateScenarioDALYs = (
  item: ChartDataItem,
  scenario: Scenario,
  advancedSettings: Record<string, number>,
): ChartDataItem => {
  const modifiedDataItem: ChartDataItem = {
    ...item,
  };

  // Start with baseline DALYs
  let adjustedDALYs = item.dalys;

  // Base scenario reduction factor (from paper)
  let reductionFactor = scenario.reductionFactor;

  // Apply effectiveness multipliers if scenario uses HEPA or Far UVC
  // These adjust the base reduction factor
  if (scenario.key.includes("hepa")) {
    const hepaMultiplier = advancedSettings.hepaEffectivenessMultiplier ?? 1.0;
    reductionFactor *= hepaMultiplier;
  } else if (scenario.key.includes("far-uvc") || scenario.key.includes("uvc")) {
    const uvcMultiplier = advancedSettings.farUvcEffectivenessMultiplier ?? 1.0;
    reductionFactor *= uvcMultiplier;
  }

  // Apply indoor air transmission percentage adjustment
  // If less transmission happens via indoor air, air cleaning is less effective
  const indoorAirPercent = advancedSettings.indoorAirTransmissionPercent ?? 60;
  const baseIndoorAirPercent = 60; // Default assumption
  const indoorAirAdjustment = indoorAirPercent / baseIndoorAirPercent;
  // Only apply to non-baseline scenarios
  if (reductionFactor > 0) {
    reductionFactor *= indoorAirAdjustment;
  }

  // Apply annual infection rate adjustment to baseline
  // If infection rate changes, adjust baseline proportionally
  const annualInfectionRate = advancedSettings.annualInfectionRate ?? 29;
  const baseInfectionRate = 29; // Default from paper
  const infectionRateAdjustment = annualInfectionRate / baseInfectionRate;
  adjustedDALYs *= infectionRateAdjustment;

  // Apply Long COVID conversion rate adjustment to baseline
  const longCovidConversionRate =
    advancedSettings.longCovidConversionRate ?? 10;
  const baseConversionRate = 10; // Estimated default
  const conversionRateAdjustment = longCovidConversionRate / baseConversionRate;
  adjustedDALYs *= conversionRateAdjustment;

  // Apply DALY weight adjustments to baseline
  // Average of less severe and moderate weights, weighted by assumed distribution
  const dalyWeightLessSevere = advancedSettings.dalyWeightLessSevere ?? 0.1;
  const dalyWeightModerate = advancedSettings.dalyWeightModerate ?? 0.4;
  const baseDalyWeightLessSevere = 0.1;
  const baseDalyWeightModerate = 0.4;
  // Assume 70% less severe, 30% moderate (adjustable assumption)
  const avgDalyWeight = dalyWeightLessSevere * 0.7 + dalyWeightModerate * 0.3;
  const baseAvgDalyWeight =
    baseDalyWeightLessSevere * 0.7 + baseDalyWeightModerate * 0.3;
  const dalyWeightAdjustment = avgDalyWeight / baseAvgDalyWeight;
  adjustedDALYs *= dalyWeightAdjustment;

  // Clamp reduction factor to valid range [0, 1]
  reductionFactor = Math.max(0, Math.min(1, reductionFactor));

  // Apply the reduction factor to get scenario DALYs
  adjustedDALYs *= 1 - reductionFactor;

  modifiedDataItem.scenarioDalys = Math.round(adjustedDALYs);

  return modifiedDataItem;
};

export function LCDALYs() {
  const [timeRange, setTimeRange] = React.useState("5y");
  const [selectedScenario, setSelectedScenario] =
    React.useState<Scenario>(getDefaultScenario());
  const [advancedSettings, setAdvancedSettings] = React.useState(
    getDefaultAdvancedSettings(),
  );

  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const handleAdvancedSettingChange = (key: string, value: number) => {
    setAdvancedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetAdvancedSettings = () => {
    setAdvancedSettings(getDefaultAdvancedSettings());
  };

  // Create chart config for baseline and selected scenario
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      dalys: {
        label: "Baseline DALYs (no intervention)",
        color: "hsl(var(--chart-1))",
      },
      scenarioDalys: {
        label: selectedScenario.label,
        color: "hsl(var(--chart-2))",
      },
    };
    return config;
  }, [selectedScenario]);

  const durationToEndDate: Record<string, Date> = {
    "5y": new Date("2031-01-01"),
    "10y": new Date("2041-01-01"),
  };

  const filteredData = chartDataItems
    .map((chartDataItem) =>
      calculateScenarioDALYs(chartDataItem, selectedScenario, advancedSettings),
    )
    .filter((item) => {
      const date = new Date(item.date);
      const startDate = new Date("2027-01-01");
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
                id="fillscenarioDalys"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-scenarioDalys)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-scenarioDalys)"
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
        <div className="mt-6 space-y-6">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={handleScenarioChange}
          />
          <AdvancedSettingsPanel
            settings={advancedSettings}
            onSettingsChange={handleAdvancedSettingChange}
            onReset={handleResetAdvancedSettings}
          />
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
