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

import React, { useState } from "react";
import { ChartModifierCheckbox } from "../chart-modifier-checkbox";
import { cn } from "@/lib/utils";
import { FieldGroup } from "../ui/field";
import { useDalyModel } from "@/hooks/use-daly-model";
import { ModelAssumptionsPanel } from "@/components/model-assumptions-panel";
import { SCENARIO_LABELS_BY_ID } from "@/config/scenario-daly-calculations";

function ChartDescriptionBody() {
  return (
    <div className="mt-2">
      <p>
        This simulation draws upon existing evidence to show the expected impact
        of population-level air cleaning interventions, like HEPA filtration and
        far-UVC light, on COVID-19-related{" "}
        <a
          href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          disability-adjusted life years (DALYs)
        </a>
        . Each DALY represents one year of healthy life lost to illness.
      </p>
      <p className="mt-2">
        The status quo scenario reflects the number of COVID-19-related DALYs
        assuming no public health action is taken to mitigate COVID-19 infection
        at the population level.
      </p>
    </div>
  );
}

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
  percent_reduction: {
    label: "Percent reduction",
    color: "var(--chart-6)",
  },
  percent_reduction_acute_covid: {
    label: "acute COVID-19",
    color: "var(--chart-1)",
  },
  percent_reduction_long_covid: {
    label: "Long COVID",
    color: "var(--chart-2)",
  },
  percent_reduction_pasc: {
    label: "other post-acute sequelae of COVID-19 infection",
    color: "var(--chart-3)",
  },
  total: {
    label: "DALYs",
    color: "var(--chart-5)",
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
  const label = SCENARIO_LABELS_BY_ID.get(scenarioId) ?? scenarioId;
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

export function AirCleaningChart({ onScenarioSelect }: BarChartStackedProps) {
  const { scenarioRows } = useDalyModel();
  const chartRows = scenarioRows.filter(
    (scenario) =>
      scenario.id === "baseline" ||
      scenario.id.startsWith("hepa_") ||
      scenario.id.startsWith("far_uvc_"),
  );
  const [legendPortal, setLegendPortal] = useState<HTMLDivElement | null>(null);
  const [breakdownChecked, setBreakdownChecked] = useState(false);
  const [percentReductionChecked, setPercentReductionChecked] = useState(false);
  const usePercentReductionBreakdown =
    breakdownChecked && percentReductionChecked;

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            How might air cleaning interventions affect COVID-19-associated
            disability?
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <FieldGroup className="order-3 mt-4 mb-2 items-center gap-2 sm:mt-0 sm:mb-0 md:order-1">
            <ChartModifierCheckbox
              checked={percentReductionChecked}
              className="w-fit"
              onCheckedChange={setPercentReductionChecked}
              title="Show percent reduction of DALYs"
            />
            <ChartModifierCheckbox
              checked={breakdownChecked}
              className="w-fit max-w-100"
              onCheckedChange={setBreakdownChecked}
              title="Show breakdown by DALYs associated with acute COVID-19 infection, Long COVID, and other post-acute sequelae of COVID-19 infection"
            />
          </FieldGroup>
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
                label={
                  percentReductionChecked
                    ? {
                        value:
                          "Percent reduction of DALYs relative to baseline",
                        position: "bottom",
                      }
                    : {
                        value: "DALYS per 1000 people",
                        position: "bottom",
                      }
                }
                width="auto"
                tickMargin={8}
              />
              <YAxis
                dataKey="id"
                axisLine={false}
                tickLine={false}
                type="category"
                width={115}
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
                  className={cn(
                    "grid grid-cols-1 gap-x-4 gap-y-2 md:mt-0 md:flex md:justify-center",
                    !breakdownChecked && "invisible",
                  )}
                />
              ) : null}

              {breakdownChecked ? (
                <>
                  <Bar
                    dataKey={
                      usePercentReductionBreakdown
                        ? "percent_reduction_acute_covid"
                        : "acute_covid"
                    }
                    stackId="a"
                    fill={
                      usePercentReductionBreakdown
                        ? "var(--color-percent_reduction_acute_covid)"
                        : "var(--color-acute_covid)"
                    }
                    cursor="pointer"
                    onClick={(data) => onScenarioSelect?.(data.payload.id)}
                  />
                  <Bar
                    dataKey={
                      usePercentReductionBreakdown
                        ? "percent_reduction_long_covid"
                        : "long_covid"
                    }
                    stackId="a"
                    fill={
                      usePercentReductionBreakdown
                        ? "var(--color-percent_reduction_long_covid)"
                        : "var(--color-long_covid)"
                    }
                    cursor="pointer"
                    onClick={(data) => onScenarioSelect?.(data.payload.id)}
                  />
                  <Bar
                    dataKey={
                      usePercentReductionBreakdown
                        ? "percent_reduction_pasc"
                        : "pasc"
                    }
                    stackId="a"
                    fill={
                      usePercentReductionBreakdown
                        ? "var(--color-percent_reduction_pasc)"
                        : "var(--color-pasc)"
                    }
                    cursor="pointer"
                    onClick={(data) => onScenarioSelect?.(data.payload.id)}
                  />
                </>
              ) : (
                <Bar
                  dataKey={
                    percentReductionChecked ? "percent_reduction" : "total"
                  }
                  fill={
                    percentReductionChecked
                      ? "var(--color-percent_reduction)"
                      : "var(--color-long_covid)"
                  }
                  cursor="pointer"
                  onClick={(data) => onScenarioSelect?.(data.payload.id)}
                />
              )}
            </BarChart>
          </ChartContainer>
          <div
            ref={setLegendPortal}
            data-chart="chart-bar-chart"
            className="order-4 text-xs md:order-1"
          />
        </div>
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody />
        </CardDescription>
        <ModelAssumptionsPanel />
      </CardContent>
    </Card>
  );
}
