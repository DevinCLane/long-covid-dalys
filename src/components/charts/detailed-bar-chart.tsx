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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useDalyModel } from "@/hooks/use-daly-model";
import { ModelAssumptionsPanel } from "@/components/model-assumptions-panel";
import {
  ChartMetricToggle,
  type ChartMetric,
} from "@/components/chart-metric-toggle";
import type { ScenarioDalyRow } from "@/config/scenario-daly-calculations";
import { useState } from "react";

export type Scenario = ScenarioDalyRow;

const chartConfig = {
  acute_covid: {
    label: "acute COVID-19",
    color: "var(--chart-1)",
  },
  long_covid: {
    label: "Long COVID",
    color: "var(--chart-2)",
  },
  pasc: {
    label: "other post-acute sequelae of COVID-19 infection",
    color: "var(--chart-3)",
  },
  total: {
    label: "Total",
    color: "var(--chart-4)",
  },
  dalys: {
    label: "DALYs per 1,000 people",
  },
  percentReduction: {
    label: "Percent reduction",
  },
} satisfies ChartConfig;

interface DetailedBarChartProps {
  scenarioId: string;
  onScenarioSelect: (scenarioId: string) => void;
}

interface ChartDescriptionBodyProps {
  scenario: Scenario;
  metric: ChartMetric;
}

function ChartDescriptionBody({ scenario, metric }: ChartDescriptionBodyProps) {
  if (metric === "percent") {
    return (
      <div>
        For the scenario "{scenario.label}", each outcome percentage is
        calculated against that outcome&apos;s status quo DALYs. Total is
        calculated from combined DALYs averted divided by combined status quo
        DALYs; the percentages are not added together.
      </div>
    );
  }

  return (
    <div>
      For the scenario "{scenario.label}", this shows a side-by-side comparison
      of DALYs for acute COVID-19, Long COVID, other post-acute sequelae of
      COVID-19 infection, and their combined total.
    </div>
  );
}

export function DetailedBarChart({
  scenarioId,
  onScenarioSelect,
}: DetailedBarChartProps) {
  const { scenarioRows } = useDalyModel();
  const [metric, setMetric] = useState<ChartMetric>("dalys");
  const scenario = scenarioRows.find((scenario) => scenario.id === scenarioId);

  if (!scenario) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-lg text-pretty md:text-2xl">
              Detailed 5-year DALYs
            </CardTitle>
            <CardDescription>
              No scenario found for "{scenarioId}".
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const detailedData = [
    {
      key: "acute_covid",
      label: "Acute COVID",
      dalys: scenario.acute_covid,
      percentReduction: scenario.percent_reduction_acute_covid,
      fill: "var(--color-acute_covid)",
    },
    {
      key: "long_covid",
      label: "Long COVID",
      dalys: scenario.long_covid,
      percentReduction: scenario.percent_reduction_long_covid,
      fill: "var(--color-long_covid)",
    },
    {
      key: "pasc",
      label: "Other sequelae",
      dalys: scenario.pasc,
      percentReduction: scenario.percent_reduction_pasc,
      fill: "var(--color-pasc)",
    },
    {
      key: "total",
      label: "Total",
      dalys: scenario.total,
      percentReduction: scenario.percent_reduction,
      fill: "var(--color-total)",
    },
  ];

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <div className="align-center mb-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
            <CardTitle className="text-lg text-pretty md:text-2xl">
              Compare outcome conditions per scenario
            </CardTitle>
            <div>
              <Select value={scenarioId} onValueChange={onScenarioSelect}>
                <SelectTrigger
                  className="w-full rounded-lg font-medium sm:ml-auto sm:flex sm:w-60"
                  aria-label="Select scenario"
                >
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent className="w-full rounded-xl">
                  {scenarioRows.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription className="mb-4 hidden md:block">
            Select a scenario from the dropdown menu to show side-by-side
            comparison of DALYs associated with acute COVID-19 infection, Long
            COVID, and other post-acute sequelae of COVID-19 infection in that
            intervention scenario.
          </CardDescription>
          <Separator />
          <CardTitle className="mt-4 text-sm text-pretty sm:text-lg">
            {scenario.label}: 5-year{" "}
            {metric === "percent" ? "DALY reduction" : "DALYs"} by outcome
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody scenario={scenario} metric={metric} />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="order-3 mt-4 md:order-1 md:mt-0">
            <ChartMetricToggle value={metric} onValueChange={setMetric} />
          </div>
          <ChartContainer
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
            id="bar-chart"
          >
            <BarChart
              accessibilityLayer
              data={detailedData}
              layout="vertical"
              margin={{
                bottom: 15,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                domain={metric === "percent" ? [0, 100] : [0, "auto"]}
                label={{
                  value:
                    metric === "percent"
                      ? "Reduction in DALYs vs status quo (%)"
                      : "DALYs per 1,000 people",
                  position: "bottom",
                }}
                width="auto"
                tickMargin={8}
              />
              <YAxis
                dataKey="label"
                type="category"
                axisLine={false}
                tickLine={false}
                width={95}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <>
                        <span className="text-muted-foreground">
                          {metric === "percent"
                            ? "Reduction vs status quo"
                            : "DALYs per 1,000"}
                        </span>
                        <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                          {Number(value).toLocaleString()}
                          {metric === "percent" ? "%" : ""}
                        </span>
                      </>
                    )}
                  />
                }
              />
              <Bar
                dataKey={metric === "percent" ? "percentReduction" : "dalys"}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <CardDescription className="mt-4 mb-4 block md:hidden">
          Select a scenario from the dropdown menu to show side-by-side
          comparison of DALYs associated with acute COVID-19 infection, Long
          COVID, and other post-acute sequelae of COVID-19 infection in that
          intervention scenario.
        </CardDescription>
        <Separator className="mt-3 block md:hidden" />
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody scenario={scenario} metric={metric} />
        </CardDescription>
        <ModelAssumptionsPanel />
      </CardContent>
    </Card>
  );
}
