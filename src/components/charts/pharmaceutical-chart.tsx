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

/**
 * Text for the chart description body
 */
function ChartDescriptionBody() {
  return (
    <div className="mt-2">
      <p>
        This simulation shows the result of synthesizing existing evidence to
        model the potential impact of several interventions on COVID-19-related{" "}
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

/*

this section builds the clickable Y axis labels

*/
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

interface ScenarioYAxisTickProps {
  x?: string | number;
  y?: string | number;
  payload?: {
    value?: string | number;
  };
  onScenarioSelect?: (scenarioId: string) => void;
}

/**
 * build clickable Y axis labels
 */
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

export function PharmaceuticalChart({
  onScenarioSelect,
}: BarChartStackedProps) {
  const { scenarioRows } = useDalyModel();
  const [legendPortal, setLegendPortal] = useState<HTMLDivElement | null>(null);
  const [breakdownChecked, setBreakdownChecked] = useState(false);
  const [dalysPer1000, setDalysPer1000] = useState(false);
  const usePercentReductionBreakdown = breakdownChecked && !dalysPer1000;

  const visibleRows = scenarioRows.filter(
    (row) =>
      row.id === "preexposure_prophylaxis" ||
      row.id === "postexposure_prophylaxis" ||
      (dalysPer1000 && row.id === "baseline"),
  );

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            Pharmaceutical interventions
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <FieldGroup className="order-3 mt-4 mb-2 gap-4 sm:mt-0 sm:mb-0 sm:w-100 md:order-1">
            <div className="flex items-center gap-4">
              <ChartModifierCheckbox
                checked={dalysPer1000}
                className="w-fit"
                onCheckedChange={setDalysPer1000}
                title="Show DALYs per 1000 people"
              />
              <ChartModifierCheckbox
                checked={breakdownChecked}
                className="w-fit max-w-100"
                onCheckedChange={setBreakdownChecked}
                title="Show breakdown by DALYs associated with acute COVID-19 infection, Long COVID, and other post-acute sequelae of COVID-19 infection"
              />
            </div>
          </FieldGroup>
          <ChartContainer
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
            id="bar-chart"
          >
            <BarChart
              accessibilityLayer
              data={visibleRows}
              layout="vertical"
              margin={{
                bottom: 15,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                label={
                  dalysPer1000
                    ? {
                        value: "DALYS per 1000 people",
                        position: "bottom",
                      }
                    : {
                        value:
                          "Percent reduction of DALYs relative to status quo",
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
                  dataKey={dalysPer1000 ? "total" : "percent_reduction"}
                  fill={
                    dalysPer1000
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
            className="order-4 mt-2 text-xs md:order-1"
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
