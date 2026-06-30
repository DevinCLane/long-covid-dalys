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

export type Scenario = (typeof chartData.scenarios)[number];

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
}

interface ChartDescriptionBodyProps {
  scenario: Scenario;
}

function ChartDescriptionBody({ scenario }: ChartDescriptionBodyProps) {
  return (
    <div>
      For the scenario "{scenario.label}", shows a side-by-side comparison of
      the DALYs for each outcome condition: Acute COVID, Long COVID, PASC, and
      their sum total
    </div>
  );
}

export function DetailedBarChart({ scenarioId }: DetailedBarChartProps) {
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
            <CardTitle className="text-l text-pretty md:text-2xl">
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
          <CardTitle className="text-l text-pretty md:text-2xl">
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
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody scenario={scenario} />
        </CardDescription>
      </CardContent>
    </Card>
  );
}
