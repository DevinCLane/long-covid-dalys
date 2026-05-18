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

import chartData from "@/data/bar-chart.json";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  acute: {
    label: "Acute",
    color: "var(--chart-1)",
  },
  lc: {
    label: "Long COVID",
    color: "var(--chart-2)",
  },
  pasc: {
    label: "PASC",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function BarChartStacked() {
  console.log(Object.keys(chartData[0]));
  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-2xl text-pretty">Long COVID</CardTitle>
          <CardTitle className="text-2xl text-pretty">
            Benefits of air cleaning interventions on COVID-19 infection and
            Long COVID-related disability-adjusted life years: A policy
            simulation
          </CardTitle>
          <CardDescription>
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
          <CardDescription>
            Select a scenario to view the resulting DALYs
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-100 w-full md:h-150">
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
            <XAxis type="number" />
            <YAxis
              dataKey="scenario"
              axisLine={false}
              tickLine={false}
              type="category"
              width={140}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="acute"
              stackId="a"
              fill="var(--color-acute)"
              // radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="lc"
              stackId="a"
              fill="var(--color-lc)"
              // radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="pasc"
              stackId="a"
              fill="var(--color-pasc)"
              // radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
