"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Text,
  usePlotArea,
  XAxis,
  YAxis,
} from "recharts";
import { ModelChartContainer } from "@/components/charts/model-chart-container";
import { ModelTooltipValues } from "@/components/charts/model-tooltip-values";
import { outcomeColors } from "@/config/chart-colors";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useDalyModel } from "@/hooks/use-daly-model";
import { ModelAssumptionsPanel } from "@/components/assumptions-panel";
import {
  ChartMetricToggle,
  type ChartMetric,
} from "@/components/chart-metric-toggle";
import type {
  ScenarioDalyRow,
  ScenarioId,
} from "@/config/scenario-daly-calculations";
import { OriginalValueMarker } from "../original-value-marker";
import { interventionsByScenario } from "@/config/assumptions";

const chartConfig = {
  acute_covid: {
    label: "acute COVID-19",
    color: outcomeColors.acute_covid,
  },
  long_covid: {
    label: "Long COVID",
    color: outcomeColors.long_covid,
  },
  pasc: {
    label: "other post-acute sequelae of COVID-19 infection",
    color: outcomeColors.pasc,
  },
  total: {
    label: "Total",
    color: outcomeColors.total,
  },
  dalys: {
    label: "DALYs per 1,000 people",
  },
  percentReduction: {
    label: "Percent reduction",
  },
} satisfies ChartConfig;

interface OutcomeBreakdownChartProps {
  scenarioId: ScenarioId;
  onScenarioSelect: (scenarioId: ScenarioId) => void;
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
}

interface ChartDescriptionBodyProps {
  scenario: ScenarioDalyRow;
  metric: ChartMetric;
}

function ChartDescriptionBody({ scenario, metric }: ChartDescriptionBodyProps) {
  if (metric === "percent") {
    return (
      <div>
        For the scenario "{scenario.label}", each outcome percentage is
        calculated against that outcome&apos;s fixed default status quo DALYs.
        {/*Total is
        calculated from combined DALYs averted divided by combined status quo
        DALYs; the percentages are not added together.*/}
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

function StatusQuoReductionLabel({ index }: { index?: number }) {
  const plotArea = usePlotArea();

  // LabelList calls this for every outcome; show the guidance just once.
  if (index !== 0 || !plotArea) return null;

  return (
    <Text
      x={plotArea.x + plotArea.width / 2}
      y={plotArea.y + plotArea.height / 2}
      width={Math.min(380, Math.max(0, plotArea.width - 32))}
      textAnchor="middle"
      verticalAnchor="middle"
      lineHeight="1.4em"
      className="fill-muted-foreground text-sm"
      pointerEvents="none"
    >
      Status quo has 0% reduction relative to itself. Choose "DALYs per 1000",
      adjust the model assumptions below, or choose another scenario to see
      results.
    </Text>
  );
}

export function OutcomeBreakdownChart({
  scenarioId,
  onScenarioSelect,
  metric,
  setMetric,
}: OutcomeBreakdownChartProps) {
  const { scenarioRows, isCustomScenario, defaultOutput } = useDalyModel();
  const scenario = scenarioRows.find((scenario) => scenario.id === scenarioId);

  const selectedScenarioWithDefaultAssumptions = defaultOutput.find(
    (selectedScenario) => selectedScenario.id === scenarioId,
  );
  const showOriginalValues =
    isCustomScenario && Boolean(selectedScenarioWithDefaultAssumptions);
  // Even status quo can change relative to the fixed reference when inputs change.
  const displayedMetric = metric;

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

  const outcomeData = [
    {
      key: "acute_covid",
      label: "Acute COVID",
      dalys: scenario.acute_covid,
      percentReduction: scenario.percent_reduction_acute_covid,
      originalDalys: selectedScenarioWithDefaultAssumptions?.acute_covid,
      originalPercentReduction:
        selectedScenarioWithDefaultAssumptions?.percent_reduction_acute_covid,
      fill: "var(--color-acute_covid)",
    },
    {
      key: "long_covid",
      label: "Long COVID",
      dalys: scenario.long_covid,
      percentReduction: scenario.percent_reduction_long_covid,
      originalDalys: selectedScenarioWithDefaultAssumptions?.long_covid,
      originalPercentReduction:
        selectedScenarioWithDefaultAssumptions?.percent_reduction_long_covid,
      fill: "var(--color-long_covid)",
    },
    {
      key: "pasc",
      label: "Other sequelae",
      dalys: scenario.pasc,
      percentReduction: scenario.percent_reduction_pasc,
      originalDalys: selectedScenarioWithDefaultAssumptions?.pasc,
      originalPercentReduction:
        selectedScenarioWithDefaultAssumptions?.percent_reduction_pasc,
      fill: "var(--color-pasc)",
    },
    {
      key: "total",
      label: "Total",
      dalys: scenario.total,
      percentReduction: scenario.percent_reduction,
      originalDalys: selectedScenarioWithDefaultAssumptions?.total,
      originalPercentReduction:
        selectedScenarioWithDefaultAssumptions?.percent_reduction,
      fill: "var(--color-total)",
    },
  ];

  // remove the "total" from percent reduction view
  const visibleOutcomeData = outcomeData.filter((dataItem) =>
    displayedMetric === "percent" ? dataItem.key !== "total" : true,
  );
  // Keep original markers in range when adjusted DALYs fall below the defaults,
  // with room for the marker label at the right edge.
  const dalyAxisMax = showOriginalValues
    ? Math.max(
        1,
        ...visibleOutcomeData.flatMap((row) => [
          row.dalys,
          row.originalDalys ?? 0,
        ]),
      ) * 1.1
    : "auto";

  const showStatusQuoGuidance =
    scenarioId === "baseline" &&
    displayedMetric === "percent" &&
    visibleOutcomeData.every((row) => row.percentReduction === 0);

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
            {displayedMetric === "percent" ? "DALY reduction" : "DALYs"} by
            outcome
          </CardTitle>
          <CardDescription className="hidden md:block">
            <ChartDescriptionBody
              scenario={scenario}
              metric={displayedMetric}
            />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="order-3 mt-4 md:order-1 md:mt-0">
            <ChartMetricToggle
              value={displayedMetric}
              onValueChange={setMetric}
            />
          </div>
          <ModelChartContainer
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
          >
            <BarChart
              accessibilityLayer
              data={visibleOutcomeData}
              layout="vertical"
              margin={{
                bottom: 15,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                domain={
                  displayedMetric === "percent" ? [0, 100] : [0, dalyAxisMax]
                }
                label={{
                  value:
                    displayedMetric === "percent"
                      ? "Reduction in DALYs vs default status quo (%)"
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
                    formatter={(value, _name, item) => (
                      <ModelTooltipValues
                        label={
                          displayedMetric === "percent"
                            ? "Reduction vs default status quo"
                            : "DALYs per 1,000"
                        }
                        value={Number(value)}
                        originalValue={
                          showOriginalValues
                            ? displayedMetric === "percent"
                              ? item.payload.originalPercentReduction
                              : item.payload.originalDalys
                            : undefined
                        }
                        showPercent={displayedMetric === "percent"}
                      />
                    )}
                  />
                }
              />
              <Bar
                dataKey={
                  displayedMetric === "percent" ? "percentReduction" : "dalys"
                }
                isAnimationActive={!showStatusQuoGuidance}
                shape={showStatusQuoGuidance ? <g /> : undefined}
              >
                {showStatusQuoGuidance && (
                  <LabelList
                    dataKey="percentReduction"
                    content={<StatusQuoReductionLabel />}
                  />
                )}
              </Bar>
              {showOriginalValues &&
                visibleOutcomeData.map((row) => {
                  const originalValue =
                    displayedMetric === "percent"
                      ? row.originalPercentReduction
                      : row.originalDalys;

                  return originalValue !== undefined ? (
                    <OriginalValueMarker
                      key={row.key}
                      x={originalValue}
                      y={row.label}
                    />
                  ) : null;
                })}
            </BarChart>
          </ModelChartContainer>
        </div>
        <CardDescription className="mt-4 mb-4 block md:hidden">
          Select a scenario from the dropdown menu to show side-by-side
          comparison of DALYs associated with acute COVID-19 infection, Long
          COVID, and other post-acute sequelae of COVID-19 infection in that
          intervention scenario.
        </CardDescription>
        <Separator className="mt-3 block md:hidden" />
        <CardDescription className="mt-3 block md:hidden">
          <ChartDescriptionBody scenario={scenario} metric={displayedMetric} />
        </CardDescription>
        <ModelAssumptionsPanel
          allowedInterventions={interventionsByScenario[scenarioId] ?? []}
        />
      </CardContent>
    </Card>
  );
}
