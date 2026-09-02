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
import type { ScenarioDalyRow } from "@/config/scenario-daly-calculations";

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
    label: "DALYs",
  },
} satisfies ChartConfig;

interface DetailedBarChartProps {
  scenarioId: string;
  onScenarioSelect: (scenarioId: string) => void;
}

interface ChartDescriptionBodyProps {
  scenario: Scenario;
}

function ChartDescriptionBody({ scenario }: ChartDescriptionBodyProps) {
  return (
    <div>
      For the scenario "{scenario.label}", shows a side-by-side comparison of
      the DALYs for each outcome condition: acute COVID-19, Long COVID, other
      post-acute sequelae of COVID-19 infection, and their sum total
    </div>
  );
}

export function DetailedBarChart({
  scenarioId,
  onScenarioSelect,
}: DetailedBarChartProps) {
  const { scenarioRows } = useDalyModel();
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
      fill: "var(--color-acute_covid)",
    },
    {
      key: "long_covid",
      label: "Long COVID",
      dalys: scenario.long_covid,
      fill: "var(--color-long_covid)",
    },
    {
      key: "pasc",
      label: "other sequelae",
      dalys: scenario.pasc,
      fill: "var(--color-pasc)",
    },
    {
      key: "total",
      label: "Total",
      dalys: scenario.total,
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
              Detailed view per scenario
            </CardTitle>
            <div>
              <Select value={scenarioId} onValueChange={onScenarioSelect}>
                <SelectTrigger
                  className="w-full rounded-lg font-medium sm:ml-auto sm:flex sm:w-60"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
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
            {scenario.label}: 5-year DALYs by outcome
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody scenario={scenario} />
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
              data={detailedData}
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
                type="category"
                axisLine={false}
                tickLine={false}
                width={95}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="dalys" />
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
          <ChartDescriptionBody scenario={scenario} />
        </CardDescription>
        <ModelAssumptionsPanel />
      </CardContent>
    </Card>
  );
}
