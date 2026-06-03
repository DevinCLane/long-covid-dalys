"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import chartData from "@/data/results_detailed_age39_10yr_adjusted.json";
import React from "react";

export type Condition = {
  condition: string;
  totals: { dalys_per_1000: number };
};

export type Scenario = {
  id: string;
  label: string;
  conditions: Condition[];
};

export const description = "A stacked bar chart with a legend";

const chartRows = chartData.scenarios.map((scenario: Scenario) => {
  const byCondition = Object.fromEntries(
    scenario.conditions.map((condition) => [
      condition.condition,
      condition.totals.dalys_per_1000,
    ]),
  );

  return {
    id: scenario.id,
    label: scenario.label,
    acute_covid: byCondition.acute_covid,
    long_covid: byCondition.long_covid,
    pasc: byCondition.pasc,
  };
});

const chartConfig = {
  acute_covid: {
    label: "Acute COVID",
    color: "var(--chart-1)",
  },
  long_covid: {
    label: "Long COVID",
    color: "var(--chart-2)",
  },
  pasc: {
    label: "PASC",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function BarChartStacked() {
  const [legendPortal, setLegendPortal] = React.useState<HTMLDivElement | null>(
    null,
  );
  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            10-year DALYs for Acute COVID, Long COVID and PASC
          </CardTitle>
          <CardDescription className="hidden md:block">
            This scenario simulator shows the result of synthesizing existing
            evidence to model the potential impact of population-level air
            cleaning interventions, like HEPA filtration and far germicidal UVC
            light, on Long COVID-related{" "}
            <a
              href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              disability-adjusted life years (DALYs)
            </a>
            . Each DALY represents one year of healthy life lost to illness.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <ChartContainer
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
            id="bar-chart"
          >
            <BarChart
              accessibilityLayer
              data={chartRows}
              layout="vertical"
              margin={{
                bottom: 15,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                label={{
                  value: "DALYS per 1000 people",
                  position: "bottom",
                }}
                width="auto"
                tickMargin={8}
              />
              <YAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                type="category"
                width={140}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              {legendPortal ? (
                <ChartLegend
                  portal={legendPortal}
                  content={<ChartLegendContent />}
                  verticalAlign="top"
                  className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 md:mt-0 md:flex md:justify-center"
                />
              ) : null}
              <Bar
                dataKey="acute_covid"
                stackId="a"
                fill="var(--color-acute_covid)"
              />
              <Bar
                dataKey="long_covid"
                stackId="a"
                fill="var(--color-long_covid)"
              />
              <Bar dataKey="pasc" stackId="a" fill="var(--color-pasc)" />
            </BarChart>
          </ChartContainer>
          <div
            ref={setLegendPortal}
            data-chart="chart-bar-chart"
            className="order-3 text-xs md:order-1"
          />
        </div>
        <CardDescription className="mt-3 block md:hidden">
          This scenario simulator shows the result of synthesizing existing
          evidence to model the potential impact of population-level air
          cleaning interventions, like HEPA filtration and far germicidal UVC
          light, on Long COVID-related{" "}
          <a
            href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            disability-adjusted life years (DALYs)
          </a>
          . Each DALY represents one year of healthy life lost to illness.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
