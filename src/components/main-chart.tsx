import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZIndexLayer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DALYsData from "@/data/DALYs.json";
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

interface DALYsDataItem {
  year: number;
  baseline: number;
  HEPAMostCommonSpaces: number;
  HEPASchoolsAndDaycare: number;
  HEPAAllPublicIndoor: number;
  farUVCMostCommonSpaces: number;
  farUVCSchoolsAndDaycare: number;
  farUVCAllPublicIndoor: number;
}

/**
 * create the curve of data over 10 years (take the 10th year and show lower numbers leading up to it)
 */
const chartDataItems = (DALYsData as DALYsDataItem[]).map(
  (dalysData, index) => {
    const entries = Object.entries(dalysData);

    const newEntries = entries.map((entry) => {
      if (entry[0] === "year") {
        return entry;
      }
      let number = entry[1];
      number *= (index + 1) * 0.1;
      return [entry[0], number];
    });
    return Object.fromEntries(newEntries);
  },
);

export function MainChart() {
  // Track selected scenarios by their ID
  const [selectedScenarios, setSelectedScenarios] = React.useState<Set<string>>(
    getDefaultSelectedScenarios,
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
  ).sort((a, b) => b.DALYs - a.DALYs);

  // State to track the previous selection for comparison
  // this is what allows the animations to run on only newly selected scenarios
  const [previousSelectedScenarios, setPreviousSelectedScenarios] =
    React.useState(selectedScenarios);
  // State to track which scenarios were just added/selected in this render cycle
  const [newlySelectedScenarios, setNewlySelectedScenarios] = React.useState<
    Set<string>
  >(new Set());

  if (selectedScenarios !== previousSelectedScenarios) {
    const newScenarios = new Set<string>();
    for (const scenario of selectedScenarios) {
      if (!previousSelectedScenarios.has(scenario)) {
        newScenarios.add(scenario);
      }
    }
    setPreviousSelectedScenarios(selectedScenarios);
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
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-2xl text-pretty">
            Benefits of air cleaning interventions on COVID-19 infection and
            Long COVID-related disability-adjusted life years: A policy
            simulation
          </CardTitle>
          <CardDescription>
            This scenario simulator shows the result of synthesizing existing
            evidence to model the potential impact of population-level air
            cleaning interventions, like HEPA filtration and far germicidal UVC
            light, on Long COVID-related{" "}
            <a
              href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              disability-adjusted life years (DALYs)
            </a>
            . Each DALY represents one year of healthy life lost to illness.
          </CardDescription>
          <CardDescription>
            Select a scenario to view the resulting DALYs
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-100 w-full md:h-150">
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
              domain={[0, 300]}
              allowDataOverflow={false}
              label={{
                value: "DALYs per 1000 people",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-card"
                  labelFormatter={(value) => `Year ${value}`}
                  indicator="dot"
                />
              }
            />

            {/* area charts (these are the main graphs on the chart) */}
            {sortedScenarios.map((scenario, index) => {
              const shouldAnimate = newlySelectedScenarios.has(scenario.id);

              return (
                <ZIndexLayer zIndex={index}>
                  <Area
                    key={scenario.id}
                    dataKey={scenario.id}
                    isAnimationActive={shouldAnimate}
                    fill={`var(--color-${scenario.id})`}
                    stroke={`var(--color-${scenario.id})`}
                    zIndex={index}
                  />
                </ZIndexLayer>
              );
            })}

            {/* test data watermark  */}
            <ZIndexLayer zIndex={9999}>
              <text
                className="left-2 text-2xl font-bold tracking-widest opacity-50 lg:text-5xl"
                x={window.innerWidth < 640 ? "60%" : "50%"}
                y={window.innerWidth < 640 ? "50%" : "50%"}
                textAnchor="middle"
              >
                TEST DATA
              </text>
            </ZIndexLayer>
          </AreaChart>
        </ChartContainer>

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
                            DALYs={scenario.DALYs}
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
