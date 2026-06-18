import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZIndexLayer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import chartData from "@/data/data.json";
import { ScenarioArea } from "@/components/scenario-area";
import {
  getDefaultSelectedScenarios,
  groupedScenarios,
  groupLabels,
  SCENARIOS,
} from "@/config/scenarios";
import { ScenarioAreaButton } from "@/components/scenario-area-button";
import { ASSUMPTIONS } from "@/config/assumptions";
import { AssumptionArea } from "@/components/assumption-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** One row per year; each scenario id is a column (Recharts wide format). */
interface DalysDataItem {
  year: number;
  baseline: number;
  hepa_most_public: number;
  hepa_schools_and_daycares: number;
  hepa_all_public: number;
  far_uvc_most_public: number;
  far_uvc_schools_and_daycares: number;
  far_uvc_all_public: number;
}

/**
 * Pivot nested datav2 → wide rows for the area chart.
 * Loop scenarios (not years): each scenario writes into the same year rows.
 */
function longCovidDalysByYear(
  scenarios: typeof chartData.scenarios,
): DalysDataItem[] {
  const byYear = new Map<number, DalysDataItem>();

  for (const scenario of scenarios) {
    const longCovid = scenario.conditions.find(
      (condition) => condition.condition === "long_covid",
    );
    if (!longCovid?.years.length) continue;

    for (const yearPoint of longCovid.years) {
      const row =
        byYear.get(yearPoint.year) ??
        ({ year: yearPoint.year } as DalysDataItem);

      // scenario.id becomes the property name (baseline, hepa_most_public, …)
      row[scenario.id as keyof Omit<DalysDataItem, "year">] =
        yearPoint.dalys_per_1000;

      byYear.set(yearPoint.year, row);
    }
  }

  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

const chartDataItems = longCovidDalysByYear(chartData.scenarios);

interface LongCovidChartProps {
  selectedScenarios: Set<string>;
  setSelectedScenarios: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function LongCovidChart({
  selectedScenarios,
  setSelectedScenarios,
}: LongCovidChartProps) {
  const [legendPortal, setLegendPortal] = React.useState<HTMLDivElement | null>(
    null,
  );
  /**
   * Updates the scenario state to represent what the user has checked.
   * Creates a new Set each time there is a new scenario selected so React knows to update.
   *
   * @param id - id of the scenario
   * @param checked - if the scenario is checked or not
   */

  const toggleScenario = (id: string, checked: boolean) => {
    setSelectedScenarios((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  /**
   * Reset selected scenarios to the default
   */
  const resetScenarios = () => {
    setSelectedScenarios(getDefaultSelectedScenarios);
  };

  /**
   * Select all scenarios
   */
  const selectAllScenarios = () => {
    setSelectedScenarios((prev) => {
      const next = new Set(prev);
      for (const scenario of SCENARIOS) {
        next.add(scenario.id);
      }
      return next;
    });
  };

  /**
   * chart config/legend is created based on selected scenarios
   */
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};

    SCENARIOS.forEach((scenario, index) => {
      if (selectedScenarios.has(scenario.id)) {
        config[scenario.id] = {
          label: scenario.label,
          color: `var(--chart-${(index % 12) + 1})`,
        };
      }
    });
    return config;
  }, [selectedScenarios]);

  /**
   * sort scenarios so that the chart is always drawn from highest DALYs to lowest DALYs.
   * this avoids the lower DALY number charts being drawn on top of the higher DALY charts
   */
  const sortedScenarios = SCENARIOS.filter((scenario) =>
    selectedScenarios.has(scenario.id),
  ).sort((a, b) => b.dalys - a.dalys);

  // State to track the previous selection for comparison
  // this is what allows the animations to run on only newly selected scenarios
  const [previouslySelectedScenarios, setPreviouslySelectedScenarios] =
    React.useState(selectedScenarios);
  // State to track which scenarios were just added/selected in this render cycle
  const [newlySelectedScenarios, setNewlySelectedScenarios] = React.useState<
    Set<string>
  >(new Set());

  // if there is a newly selected scenario (current !== prev)
  if (selectedScenarios !== previouslySelectedScenarios) {
    const newScenarios = new Set<string>();
    for (const scenario of selectedScenarios) {
      // find the newly selected scenario
      if (!previouslySelectedScenarios.has(scenario)) {
        // add it to the new scenarios
        newScenarios.add(scenario);
      }
    }
    // update the prev selected scenarios with currently selected scenarios
    setPreviouslySelectedScenarios(selectedScenarios);
    // set newly selected scenarios with the new scenario
    setNewlySelectedScenarios(newScenarios);
  }

  /**
   * update the slider value
   */
  const handleSliderChange = (value: number) => {
    return value;
  };

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <CardTitle className="text-l text-pretty md:text-2xl">
          5-year DALYs for Long COVID by scenario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <ChartContainer
            id="long-covid-dalys"
            config={chartConfig}
            className="order-2 h-100 w-full md:h-150"
          >
            <AreaChart
              data={chartDataItems}
              margin={{
                bottom: 15,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => 2026 + value}
                interval={"preserveStartEnd"}
                label={{
                  value: "Years",
                  position: "bottom",
                }}
              />
              <YAxis
                axisLine={false}
                tick={{ width: 250 }}
                tickMargin={8}
                domain={[0, 24]}
                allowDataOverflow={false}
                label={{
                  value: "DALYs per 1000 people",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              {legendPortal ? (
                <ChartLegend
                  portal={legendPortal}
                  content={<ChartLegendContent />}
                  verticalAlign="top"
                  className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 md:mt-0 md:grid-cols-3 md:justify-items-center"
                />
              ) : null}
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="bg-card px-4 py-2"
                    labelFormatter={(value) => `Year ${value}`}
                    indicator="dot"
                  />
                }
              />

              {/* area charts (these are the main graphs on the chart) */}
              {sortedScenarios.map((scenario, index) => {
                const shouldAnimate = newlySelectedScenarios.has(scenario.id);

                return (
                  <ZIndexLayer key={index} zIndex={index}>
                    <Area
                      key={scenario.id}
                      dataKey={scenario.id}
                      isAnimationActive={shouldAnimate}
                      fill={`var(--color-${scenario.id})`}
                      stroke={`var(--color-${scenario.id})`}
                    />
                  </ZIndexLayer>
                );
              })}

              {/* test data watermark  */}
              <ZIndexLayer zIndex={9999}>
                <text
                  className="left-2 text-2xl font-bold tracking-widest opacity-50 lg:text-5xl"
                  x={window.innerWidth < 640 ? "60%" : "50%"}
                  y={window.innerWidth < 640 ? "80%" : "50%"}
                  textAnchor="middle"
                >
                  TEST DATA
                </text>
              </ZIndexLayer>
            </AreaChart>
          </ChartContainer>
          {/* mobile: legend on bottom (hide this on desktop) */}
          <div
            ref={setLegendPortal}
            data-chart="chart-long-covid-dalys"
            className="order-3 text-xs md:order-1"
          />
        </div>

        <Accordion type="multiple" defaultValue={["scenarios"]}>
          {/* scenario selector */}
          <AccordionItem value="scenarios">
            <AccordionTrigger className="text-xl">Scenarios</AccordionTrigger>
            <AccordionContent>
              <div>
                <div className="mb-4 flex flex-col items-end gap-4">
                  <ScenarioAreaButton
                    onClick={resetScenarios}
                    label="Reset scenarios"
                  />
                  <ScenarioAreaButton
                    onClick={selectAllScenarios}
                    label="Select all scenarios"
                  />
                </div>
                {Object.entries(groupedScenarios).map(
                  ([groupName, scenarios]) => (
                    <div key={groupName} className="mb-6">
                      <h3 className="mb-2 text-lg font-semibold">
                        {groupLabels[groupName] || groupName}
                      </h3>
                      <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                        {scenarios.map((scenario) => (
                          <ScenarioArea
                            key={scenario.id}
                            id={scenario.id}
                            group={scenario.group}
                            label={scenario.label}
                            dalys={scenario.dalys}
                            infected={scenario.infected}
                            sublabel={scenario.sublabel}
                            checked={selectedScenarios.has(scenario.id)}
                            onCheckedChange={(checked) =>
                              toggleScenario(scenario.id, checked)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Adjust model assumptions */}
          <AccordionItem value="modelAssumptions">
            <AccordionTrigger className="text-xl">
              Model Assumptions
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                {ASSUMPTIONS.map((assumption) => (
                  <AssumptionArea
                    key={assumption.key}
                    sliderLabel={assumption.sliderLabel}
                    sliderSubLabel={assumption.sliderSubLabel}
                    sliderMin={assumption.sliderMin}
                    sliderMax={assumption.sliderMax}
                    sliderStep={assumption.sliderStep}
                    sliderInitialValue={assumption.defaultValue}
                    sliderDefaultValue={assumption.defaultValue}
                    sliderDisabled={false}
                    onSliderChange={([value]) => handleSliderChange(value)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
