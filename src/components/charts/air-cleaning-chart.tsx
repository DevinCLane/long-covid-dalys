"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ModelChartContainer } from "@/components/charts/model-chart-container";
import { ModelTooltipValues } from "@/components/charts/model-tooltip-values";
import { getScenarioColor } from "@/config/chart-colors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import React from "react";
import { ChartModifierRadio } from "@/components/chart-modifier-radio";
import { ChartMetricToggle, type ChartMetric } from "../chart-metric-toggle";
import { FieldGroup } from "../ui/field";
import { useDalyModel } from "@/hooks/use-daly-model";
import { ModelAssumptionsPanel } from "@/components/assumptions-panel";
import {
  SCENARIO_IDS,
  SCENARIO_LABELS_BY_ID,
  ScenarioId,
} from "@/config/scenario-daly-calculations";
import { OriginalValueMarker } from "../original-value-marker";
import { interventionsByScenario } from "@/config/assumptions";
import { AirId } from "@/config/iframe-messages";
import { Separator } from "../ui/separator";

/**
 * Text for the chart description body
 */
function ChartDescriptionBody() {
  return (
    <div className="mt-2">
      <p>
        This simulation shows the result of synthesizing existing evidence to
        model the potential impact of air cleaning interventions on
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
  function isScenarioId(value: string): value is ScenarioId {
    return SCENARIO_IDS.some((allowedId) => allowedId === value);
  }
  const value = String(payload?.value ?? "");
  const scenarioId = isScenarioId(value) ? value : undefined;
  const label = SCENARIO_LABELS_BY_ID.get(value) ?? value;
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
  },
  total: {
    label: "Total DALYs",
  },
} satisfies ChartConfig;

interface AirCleaningChartProps {
  onScenarioSelect?: (scenarioId: ScenarioId) => void;
  airInterventionFilter: AirId;
  onAirInterventionFilterChange: (value: AirId) => void;
  metric: ChartMetric;
  setMetric: (metric: ChartMetric) => void;
}

export function AirCleaningChart({
  onScenarioSelect,
  airInterventionFilter,
  onAirInterventionFilterChange,
  metric,
  setMetric,
}: AirCleaningChartProps) {
  const {
    scenarioRows: chartRows,
    defaultOutput,
    isCustomScenario,
  } = useDalyModel();
  const showDalys = metric === "dalys";
  const visibleRows = chartRows.filter((row) => {
    if (row.id === "baseline") return showDalys;
    const interventions = interventionsByScenario[row.id] ?? [];
    return airInterventionFilter === "all"
      ? interventions.includes("hepa") || interventions.includes("uvc")
      : interventions.includes(airInterventionFilter);
  });

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            How might air cleaning interventions affect COVID-associated
            disability?
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <FieldGroup className="order-3 mt-4 mb-2 justify-between gap-4 sm:mt-0 sm:mb-4 sm:flex-row md:order-1">
            <ChartModifierRadio
              options={[
                {
                  value: "all",
                  label: "All interventions",
                },
                {
                  value: "hepa",
                  label: "HEPA filters",
                },
                {
                  value: "uvc",
                  label: "Far UVC",
                },
              ]}
              value={airInterventionFilter}
              onValueChange={onAirInterventionFilterChange}
            />
            <div className="flex justify-center">
              <ChartMetricToggle value={metric} onValueChange={setMetric} />
            </div>
          </FieldGroup>
          <ModelChartContainer
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
          >
            <BarChart
              accessibilityLayer
              data={visibleRows.map((row) => ({
                ...row,
                fill: getScenarioColor(row.id),
              }))}
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
                        value:
                          "Reduction in total DALYs vs default status quo (%)",
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
                    formatter={(value, _name, item) => {
                      const originalRow = isCustomScenario
                        ? defaultOutput.find(
                            (row) => row.id === item.payload.id,
                          )
                        : undefined;

                      return (
                        <ModelTooltipValues
                          label={
                            showDalys
                              ? "Total DALYs per 1,000"
                              : "Total DALY reduction"
                          }
                          value={Number(value)}
                          originalValue={
                            showDalys
                              ? originalRow?.total
                              : originalRow?.percent_reduction
                          }
                          showPercent={!showDalys}
                        />
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey={showDalys ? "total" : "percent_reduction"}
                cursor="pointer"
                onClick={(data) => onScenarioSelect?.(data.payload.id)}
              />
              {isCustomScenario &&
                defaultOutput.map(
                  (originalRow) =>
                    visibleRows.some((row) => row.id === originalRow.id) && (
                      <OriginalValueMarker
                        key={originalRow.id}
                        x={
                          showDalys
                            ? originalRow.total
                            : originalRow.percent_reduction
                        }
                        y={originalRow.id}
                      />
                    ),
                )}
            </BarChart>
          </ModelChartContainer>
        </div>
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody />
        </CardDescription>
        <ModelAssumptionsPanel allowedInterventions={["hepa", "uvc"]} />
      </CardContent>
    </Card>
  );
}
