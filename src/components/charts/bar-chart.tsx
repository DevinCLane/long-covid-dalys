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

import chartData from "@/data/data.json";
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

function ChartDescriptionBody() {
  return (
    <>
      This scenario simulator shows the result of synthesizing existing evidence
      to model the potential impact of population-level air cleaning
      interventions, like HEPA filtration and far germicidal UVC light, on Long
      COVID-related{" "}
      <a
        href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
        target="_blank"
        rel="noreferrer"
        className="font-medium underline underline-offset-4"
      >
        disability-adjusted life years (DALYs)
      </a>
      . Each DALY represents one year of healthy life lost to illness.
    </>
  );
}

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

const scenarioLabelsById = new Map(
  chartRows.map((scenario) => [scenario.id, scenario.label]),
);

// formatting/text wrapping for the y axis labels
const Y_AXIS_LABEL_MAX_CHARS = 17;
const Y_AXIS_LABEL_WIDTH = 132;
const Y_AXIS_LABEL_LINE_HEIGHT = 13;

function wrapScenarioLabel(label: string) {
  const lines: string[] = [];
  const words = label.split(" ");

  for (const word of words) {
    const currentLine = lines[lines.length - 1];
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || nextLine.length > Y_AXIS_LABEL_MAX_CHARS) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = nextLine;
    }
  }

  return lines;
}

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

interface BarChartStackedProps {
  onScenarioSelect?: (scenarioId: string) => void;
}

interface ScenarioYAxisTickProps {
  x?: string | number;
  y?: string | number;
  payload?: {
    value?: string | number;
  };
  onScenarioSelect?: (scenarioId: string) => void;
}

// this is what makes the labels for the y axis clickable
function ScenarioYAxisTick({
  x = 0,
  y = 0,
  payload,
  onScenarioSelect,
}: ScenarioYAxisTickProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const scenarioId = String(payload?.value ?? "");
  const label = scenarioLabelsById.get(scenarioId) ?? scenarioId;
  const labelLines = wrapScenarioLabel(label);
  const isClickable = Boolean(scenarioId && onScenarioSelect);
  const labelHeight = labelLines.length * Y_AXIS_LABEL_LINE_HEIGHT + 6;
  const firstLineDy =
    labelLines.length === 1
      ? 4
      : 4 - ((labelLines.length - 1) * Y_AXIS_LABEL_LINE_HEIGHT) / 2;

  function handleSelect() {
    if (scenarioId) {
      onScenarioSelect?.(scenarioId);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  }

  return (
    <g
      transform={`translate(${x},${y})`}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View details for ${label}` : undefined}
      className={isClickable ? "cursor-pointer outline-none" : undefined}
      onClick={isClickable ? handleSelect : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      onFocus={isClickable ? () => setIsFocused(true) : undefined}
      onBlur={isClickable ? () => setIsFocused(false) : undefined}
    >
      <rect
        x={-Y_AXIS_LABEL_WIDTH - 4}
        y={-(labelHeight / 2)}
        width={Y_AXIS_LABEL_WIDTH + 8}
        height={labelHeight}
        rx={4}
        fill="transparent"
        stroke={isFocused ? "var(--ring)" : "transparent"}
        strokeWidth={1.5}
        pointerEvents="all"
      />
      <text
        x={0}
        y={0}
        textAnchor="end"
        className="fill-muted-foreground hover:fill-foreground text-xs"
      >
        {labelLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={0}
            dy={index === 0 ? firstLineDy : Y_AXIS_LABEL_LINE_HEIGHT}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function BarChartStacked({ onScenarioSelect }: BarChartStackedProps) {
  const [legendPortal, setLegendPortal] = React.useState<HTMLDivElement | null>(
    null,
  );

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            5-year DALYs for Acute COVID, Long COVID and PASC
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
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
                dataKey="id"
                axisLine={false}
                tickLine={false}
                type="category"
                width={150}
                tick={(props) => (
                  <ScenarioYAxisTick
                    {...props}
                    onScenarioSelect={onScenarioSelect}
                  />
                )}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) => {
                      return payload[0]?.payload?.label ?? label;
                    }}
                  />
                }
              />
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
                cursor="pointer"
                onClick={(data) => onScenarioSelect?.(data.payload.id)}
              />
              <Bar
                dataKey="long_covid"
                stackId="a"
                fill="var(--color-long_covid)"
                cursor="pointer"
                onClick={(data) => onScenarioSelect?.(data.payload.id)}
              />
              <Bar
                dataKey="pasc"
                stackId="a"
                fill="var(--color-pasc)"
                cursor="pointer"
                onClick={(data) => onScenarioSelect?.(data.payload.id)}
              />
            </BarChart>
          </ChartContainer>
          <div
            ref={setLegendPortal}
            data-chart="chart-bar-chart"
            className="order-3 text-xs md:order-1"
          />
        </div>
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody />
        </CardDescription>
      </CardContent>
    </Card>
  );
}
