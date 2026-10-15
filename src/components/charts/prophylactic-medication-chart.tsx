"use client";

import { BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartControls } from "@/components/chart-controls";
import {
  dalysAvertedAxisDomain,
  scenarioChartMetric,
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
import { ScenarioYAxisTick } from "@/components/charts/model-y-axis-tick";
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

import type { ChartMetric } from "../chart-metric-toggle";
import { useDalyModel } from "@/hooks/use-daly-model";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ModelAssumptionsPanel } from "@/components/assumptions-panel";
import {
  PROPHYLACTIC_MEDICATION_SCENARIO_IDS,
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
        model the potential impact of prophylactic medication interventions on
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
        The status quo scenario reflects the number of COVID-19-related DALYs
        assuming no public health action is taken to mitigate COVID-19 infection
        at the population level.
      </p>
    </div>
  );
}

const CHART_TITLE =
  "How might prophylactic medication interventions affect COVID-associated disability?";

const chartConfig = {
  dalys_averted: {
    label: "Total DALYs averted",
  },
  percent_reduction: {
    label: "Total DALY reduction",
  },
  total: {
    label: "Total DALYs",
  },
} satisfies ChartConfig;

interface ProphylacticMedicationChartProps extends ChartSortProps {
  onScenarioSelect?: (scenarioId: ScenarioId) => void;
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
}

export function ProphylacticMedicationChart({
  onScenarioSelect,
  metric,
  setMetric,
  sortOrder,
  setSortOrder,
}: ProphylacticMedicationChartProps) {
  const isMobile = useIsMobile();
  const {
    scenarioRows: chartRows,
    defaultOutput,
    isCustomScenario,
  } = useDalyModel();
  const showDalys = metric === "dalys";
  const showPercent = metric === "percent";
  const { dataKey, axisLabel, tooltipLabel } = scenarioChartMetric(
    metric,
    isMobile,
  );
  const visibleRows = chartRows.filter(
    (row) =>
      PROPHYLACTIC_MEDICATION_SCENARIO_IDS.has(row.id) ||
      (showDalys && row.id === "baseline"),
  );
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
              description: chartImageDescription(metric, sortOrder),
              fileName: `prophylactic-medication-${metric}${isCustomScenario ? "-custom" : ""}`,
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
                width={115}
                tick={(props) => <ScenarioYAxisTick {...props} />}
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
            "preexposureProphylaxis",
            "postexposureProphylaxis",
          ]}
        />
      </CardContent>
    </Card>
  );
}
