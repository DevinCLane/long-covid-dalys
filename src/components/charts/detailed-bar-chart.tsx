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

import chartData from "@/data/data.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export type Scenario = (typeof chartData.scenarios)[number];

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
  scenarioId: Scenario["id"];
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
  // exclude the pasc components from this chart
  const includedConditions = new Set(["acute_covid", "long_covid", "pasc"]);

  // match the scenario that has been clicked by the user
  const scenario = chartData.scenarios.find(
    (scenario) => scenario.id === scenarioId,
  );

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

  const conditionRows = scenario.conditions
    // filter out the pasc components
    .filter((condition) => includedConditions.has(condition.condition))
    // create the shape needed for this chart
    .map((condition) => ({
      key: condition.condition,
      label: condition.label,
      dalys: condition.totals.dalys_per_1000,
      fill: `var(--color-${condition.condition})`,
    }));

  // sum up the total dalys between acute, long covid, and pasc
  const totalDalys = conditionRows.reduce((sum, row) => sum + row.dalys, 0);

  const detailedData =
    conditionRows.length > 0
      ? [
          ...conditionRows,
          // add the total dalys to the data
          {
            key: "total",
            label: "Total",
            dalys: totalDalys,
            fill: "var(--color-total)",
          },
        ]
      : [];

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
                  {chartData.scenarios.map((scenario) => (
                    <SelectItem value={scenario.id}>
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
                width={140}
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
        <Separator />
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody scenario={scenario} />
        </CardDescription>
      </CardContent>
    </Card>
  );
}
