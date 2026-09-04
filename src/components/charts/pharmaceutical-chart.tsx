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

import React, { useState } from "react";
import { ChartMetricToggle, type ChartMetric } from "../chart-metric-toggle";
import { FieldGroup } from "../ui/field";
import { Separator } from "../ui/separator";
import { useDalyModel } from "@/hooks/use-daly-model";
import { ModelAssumptionsPanel } from "@/components/model-assumptions-panel";
import {
  PHARMACEUTICAL_INTERVENTION_SCENARIO_IDS,
  SCENARIO_LABELS_BY_ID,
  ScenarioId,
} from "@/config/scenario-daly-calculations";
import { ChartModifierRadio, RadioOption } from "../chart-modifier-radio";

/**
 * Text for the chart description body
 */
function ChartDescriptionBody() {
  return (
    <div className="mt-2">
      <p>
        This simulation shows the result of synthesizing existing evidence to
        model the potential impact of pharmaceutical interventions on
        COVID-19-related{" "}
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
  onScenarioSelect?: (scenarioId: ScenarioId) => void;
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
  percent_reduction: {
    label: "Total DALY reduction",
    color: "var(--chart-2)",
  },
  total: {
    label: "Total DALYs",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

interface PharmaceuticalChartProps {
  onScenarioSelect?: (scenarioId: ScenarioId) => void;
}

export function PharmaceuticalChart({
  onScenarioSelect,
}: PharmaceuticalChartProps) {
  const { scenarioRows: chartRows } = useDalyModel();
  const [metric, setMetric] = useState<ChartMetric>("percent");
  const [chartFilter, setChartFilter] = useState<RadioOption["value"]>("all");
  const showDalys = metric === "dalys";
  const visibleRows = chartRows.filter((row) => {
    if (
      chartFilter === "all" &&
      PHARMACEUTICAL_INTERVENTION_SCENARIO_IDS.has(row.id)
    )
      return true;
    if (chartFilter === "prophylaxis" && row.id.endsWith("prophylaxis"))
      return true;
    if (chartFilter === "longCovidMedication" && row.id.endsWith("reduction"))
      return true;
    if (showDalys && row.id.startsWith("baseline")) return true;
    return false;
  });

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            How might pharmaceutical interventions affect COVID-associated
            disability?
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <FieldGroup className="order-3 mt-4 mb-2 gap-4 sm:mt-0 sm:mb-0 sm:w-100 md:order-1">
            <div className="">
              <ChartModifierRadio
                options={[
                  {
                    value: "all",
                    label: "Show all pharmaceutical interventions",
                  },
                  {
                    value: "prophylaxis",
                    label: "Show only prophylactic medication",
                  },
                  {
                    value: "longCovidMedication",
                    label: "Show only long COVID medication",
                  },
                ]}
                value={chartFilter}
                onValueChange={setChartFilter}
              />
            </div>
            <Separator />
            <div className="flex justify-center">
              <ChartMetricToggle value={metric} onValueChange={setMetric} />
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
                domain={showDalys ? [0, "auto"] : [0, 100]}
                label={
                  showDalys
                    ? {
                        value: "Total DALYs per 1,000 people",
                        position: "bottom",
                      }
                    : {
                        value: "Reduction in total DALYs vs status quo (%)",
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
                    formatter={(value) => (
                      <>
                        <span className="text-muted-foreground">
                          {showDalys
                            ? "Total DALYs per 1,000"
                            : "Total DALY reduction"}
                        </span>
                        <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                          {Number(value).toLocaleString()}
                          {showDalys ? "" : "%"}
                        </span>
                      </>
                    )}
                  />
                }
              />
              <Bar
                dataKey={showDalys ? "total" : "percent_reduction"}
                fill={
                  showDalys
                    ? "var(--color-total)"
                    : "var(--color-percent_reduction)"
                }
                cursor="pointer"
                onClick={(data) => onScenarioSelect?.(data.payload.id)}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody />
        </CardDescription>
        <ModelAssumptionsPanel />
      </CardContent>
    </Card>
  );
}
