"use client";

import { BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartControls } from "@/components/chart-controls";
import { ChartModifierRadio } from "@/components/chart-modifier-radio";
import type { LongCovidMedicationInterventionFilter } from "@/config/iframe-messages";
import {
  dalysAvertedAxisDomain,
  longCovidMedicationChartMetric,
} from "@/lib/chart-metric";
import { sortChartRows, type ChartSortProps } from "@/lib/chart-sort";
import { chartImageDescription } from "@/lib/chart-image";
import {
  ModelBar,
  ModelChartContainer,
} from "@/components/charts/model-chart-container";
import {
  ModelBarValueLabel,
  MODEL_VALUE_LABEL_MARGIN,
} from "@/components/charts/model-bar-value-label";
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
import type { ChartMetric } from "../chart-metric-toggle";
import { useDalyModel } from "@/hooks/use-daly-model";
import { interventionsByScenario } from "@/config/assumptions";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ModelAssumptionsPanel } from "@/components/assumptions-panel";
import {
  LONG_COVID_MEDICATION_SCENARIO_IDS,
  SCENARIO_IDS,
  SCENARIO_LABELS_BY_ID,
  ScenarioId,
} from "@/config/scenario-daly-calculations";
import { OriginalValueMarker } from "../original-value-marker";

/**
 * Text for the chart description body
 */
function ChartDescriptionBody() {
  return (
    <div className="mt-2">
      <p>
        This simulation shows the result of synthesizing existing evidence to
        model the potential impact of Long COVID medication interventions on
        COVID-19-related{" "}
        <a
          href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          disability-adjusted life years (DALYs)
        </a>{" "}
        over five years. Each DALY represents one year of healthy life lost to
        illness.
      </p>
      <p className="mt-2">
        The scenarios use 10% and 20% reductions by default. Symptom-burden
        scenarios reduce both Long COVID disability weights; disease-progression
        scenarios reduce progression to significant activity limitations.
        Percent reduction compares DALYs averted with Long COVID DALYs alone in
        the default status quo, assuming no intervention. Acute COVID and PASC
        DALYs are excluded from that percentage.
      </p>
    </div>
  );
}

/*

this section builds the clickable Y axis labels

*/
// formatting/text wrapping for the y axis labels
const Y_AXIS_LABEL_MAX_CHARS = 20;
const Y_AXIS_LABEL_WIDTH = 144;
const Y_AXIS_LABEL_LINE_HEIGHT = 13;
const Y_AXIS_TICK_MARGIN = 8;

function wrapScenarioLabel(label: string, maxChars: number) {
  const lines: string[] = [];
  // Wrap compound words too, so "disease-progression" cannot overflow a line.
  const words = label.split(/[\s-]+/);

  for (const word of words) {
    const currentLine = lines[lines.length - 1];
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || nextLine.length > maxChars) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = nextLine;
    }
  }

  return lines;
}

interface ScenarioYAxisTickProps {
  label?: string;
  labelWidth?: number;
  maxChars?: number;
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
  label: displayLabel,
  labelWidth = Y_AXIS_LABEL_WIDTH,
  maxChars = Y_AXIS_LABEL_MAX_CHARS,
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
  const label = displayLabel ?? SCENARIO_LABELS_BY_ID.get(value) ?? value;
  const labelLines = wrapScenarioLabel(label, maxChars);
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
        x={-labelWidth - 4}
        y={-(labelHeight / 2)}
        width={labelWidth + 8}
        height={labelHeight}
        rx={4}
        fill="transparent"
        stroke={isClickable && isFocused ? "var(--ring)" : "transparent"}
        strokeWidth={1.5}
        pointerEvents="all"
      />
      <text
        x={0}
        y={0}
        textAnchor="end"
        className={`fill-muted-foreground text-xs${isClickable ? "hover:fill-foreground" : ""}`}
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

const CHART_TITLE =
  "How might Long COVID medication interventions affect COVID-associated disability?";

const INTERVENTION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "diseaseProgression", label: "Disease progression reduction" },
  { value: "symptomBurden", label: "Symptom burden reduction" },
] satisfies { value: LongCovidMedicationInterventionFilter; label: string }[];

const chartConfig = {
  dalys_averted: {
    label: "Total DALYs averted",
  },
  percent_dalys_averted_vs_no_intervention: {
    label: "Long COVID DALY reduction",
  },
  total: {
    label: "Total DALYs",
  },
} satisfies ChartConfig;

interface LongCovidMedicationChartProps extends ChartSortProps {
  interventionFilter: LongCovidMedicationInterventionFilter;
  onInterventionFilterChange: (
    value: LongCovidMedicationInterventionFilter,
  ) => void;
  onScenarioSelect?: (scenarioId: ScenarioId) => void;
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
}

export function LongCovidMedicationChart({
  interventionFilter,
  onInterventionFilterChange,
  onScenarioSelect,
  metric,
  setMetric,
  sortOrder,
  setSortOrder,
}: LongCovidMedicationChartProps) {
  const isMobile = useIsMobile();
  const axisLabelWidth = isMobile ? 108 : Y_AXIS_LABEL_WIDTH;
  const {
    assumptions,
    scenarioRows: chartRows,
    defaultOutput,
    isCustomScenario,
  } = useDalyModel();
  const showDalys = metric === "dalys";
  const showPercent = metric === "percent";
  const { dataKey, axisLabel, tooltipLabel } = longCovidMedicationChartMetric(
    metric,
    isMobile,
  );
  const visibleRows = chartRows
    .filter((row) => {
      if (row.id === "baseline") return showDalys;
      if (!LONG_COVID_MEDICATION_SCENARIO_IDS.has(row.id)) return false;
      if (interventionFilter === "all") return true;
      const familyPrefix =
        interventionFilter === "diseaseProgression"
          ? "long_covid_progression_reduction"
          : "long_covid_disability_reduction";
      return row.id.startsWith(familyPrefix);
    })
    .map((row) => {
      const intervention = interventionsByScenario[row.id]?.[0];
      return intervention
        ? {
            ...row,
            label: row.label.replace(/^\d+%/, `${assumptions[intervention]}%`),
          }
        : row;
    });
  const sortedRows = sortChartRows(
    visibleRows,
    sortOrder,
    (row) => row[dataKey],
  );

  const originalMarkers = isCustomScenario
    ? defaultOutput
        .filter((row) => visibleRows.some((visible) => visible.id === row.id))
        .map((row) => ({ x: row[dataKey], y: row.id }))
    : [];

  return (
    <Card className="gap-3 pt-3 md:gap-6 md:pt-6">
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row [.border-b]:pb-3 md:[.border-b]:pb-6">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-l text-pretty md:text-2xl">
            {CHART_TITLE}
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ChartControls
            metric={metric}
            setMetric={setMetric}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            interventions={
              <ChartModifierRadio<LongCovidMedicationInterventionFilter>
                options={INTERVENTION_OPTIONS}
                value={interventionFilter}
                onValueChange={onInterventionFilterChange}
              />
            }
          />
          <ModelChartContainer
            accessibleData={{
              valueLabel: tooltipLabel,
              showPercent,
              rows: sortedRows.map((row) => ({
                id: row.id,
                label: row.label,
                value: row[dataKey],
                originalValue: isCustomScenario
                  ? defaultOutput.find((original) => original.id === row.id)?.[
                      dataKey
                    ]
                  : undefined,
              })),
            }}
            image={{
              title: CHART_TITLE,
              description: chartImageDescription(
                metric,
                sortOrder,
                [
                  INTERVENTION_OPTIONS.find(
                    (option) => option.value === interventionFilter,
                  )?.label,
                  showPercent ? "Long COVID DALYs only" : undefined,
                ]
                  .filter(Boolean)
                  .join(" · "),
              ),
              fileName: `long-covid-medication-${metric}-${interventionFilter}${isCustomScenario ? "-custom" : ""}`,
            }}
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
          >
            <BarChart
              aria-label={`${CHART_TITLE} Use Left and Right arrow keys to explore values.`}
              accessibilityLayer
              data={sortedRows.map((row) => ({
                ...row,
                fill: getScenarioColor(row.id),
              }))}
              layout="vertical"
              margin={{
                left: 8,
                bottom: 15,
                right: MODEL_VALUE_LABEL_MARGIN,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                domain={
                  metric === "averted" ? dalysAvertedAxisDomain : [0, "auto"]
                }
                label={{
                  value: axisLabel,
                  position: "bottom",
                  fill: "var(--muted-foreground)",
                }}
                width="auto"
                tickMargin={8}
              />
              <YAxis
                dataKey="id"
                axisLine={false}
                tickLine={false}
                type="category"
                width={axisLabelWidth + Y_AXIS_TICK_MARGIN}
                tickMargin={Y_AXIS_TICK_MARGIN}
                interval={0}
                tick={(props) => (
                  <ScenarioYAxisTick
                    {...props}
                    labelWidth={axisLabelWidth}
                    maxChars={isMobile ? 16 : Y_AXIS_LABEL_MAX_CHARS}
                    label={
                      visibleRows.find((row) => row.id === props.payload.value)
                        ?.label
                    }
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
                          label={tooltipLabel}
                          value={Number(value)}
                          originalValue={originalRow?.[dataKey]}
                          showPercent={showPercent}
                        />
                      );
                    }}
                  />
                }
              />
              <ModelBar
                dataKey={dataKey}
                cursor={isMobile ? "default" : "pointer"}
                onClick={
                  isMobile
                    ? undefined
                    : (data) => onScenarioSelect?.(data.payload.id)
                }
              >
                <LabelList
                  dataKey={dataKey}
                  content={
                    <ModelBarValueLabel
                      showPercent={showPercent}
                      originalMarkers={originalMarkers}
                    />
                  }
                />
              </ModelBar>
              {originalMarkers.map((marker) => (
                <OriginalValueMarker key={marker.y} {...marker} />
              ))}
            </BarChart>
          </ModelChartContainer>
        </div>
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody />
        </CardDescription>
        <ModelAssumptionsPanel
          allowedInterventions={[
            "longCovidProgressionReduction",
            "longCovidProgressionReductionSubstantial",
            "longCovidDisabilityReduction",
            "longCovidDisabilityReductionSubstantial",
          ]}
        />
      </CardContent>
    </Card>
  );
}
