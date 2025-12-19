import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { getDefaultSelectedScenarios, SCENARIOS } from "@/config/scenarios";
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

const chartDataItems = DALYsData as DALYsDataItem[];

export function MainChart() {
  // Track selected scenarios by their ID
  const [selectedScenarios, setSelectedScenarios] = React.useState(
    getDefaultSelectedScenarios,
  );

  /**
   * Updates the scenario state to represent what the user has checked.
   * Creates a new Set each time there is a new scenario selected so React knows to update.
   *
   * @param id - id of the scenario
   * @param checked - if the scenario is checked or not
   *
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
          color: `hsl(var(--chart-${(index % 12) + 1}))`,
        };
      }
    });
    return config;
  }, [selectedScenarios]);

  //
  /**
   * sort scenarios so that the chart is always drawn from highest DALYs to lowest DALYs.
   * this avoids the lower DALY number charts being drawn on top of the higher DALY charts
   */
  const sortedScenarios = React.useMemo(() => {
    return SCENARIOS.filter((scenario) =>
      selectedScenarios.has(scenario.id),
    ).sort((a, b) => b.DALYs - a.DALYs);
  }, [selectedScenarios]);

  // keep track of which scenario's we've already shown
  // this way, if the DOM nodes need to shift
  // (if we add a new Area to the chart with a higher number DALYs than what is currently visible)
  // then we don't re-render the animation for the Area charts that are already there
  const renderedIds = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    // create a new set for the refs on each change to selectedScenarios
    // this way we show the animation again if someone unchecks, then re-checkes a scenario
    renderedIds.current = new Set(selectedScenarios);
  }, [selectedScenarios]);

  const handleSliderChange = (value: number) => {
    return value;
  };

  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Long Covid Disease Burden in the United States</CardTitle>
          <CardDescription>
            Showing the total disease burden of long covid as measured in{" "}
            <a
              href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Disability-adjusted life years (DALYs)
            </a>
            . Each DALY represents one year of healthy life lost to illness.
          </CardDescription>
          <CardDescription>
            Based on research showing 80 DALYs per 1,000 long COVID cases
            <sup>1</sup> with an estimated 17M cases of long COVID
            <sup>2</sup> in the US.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full md:h-[600px]"
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
            {sortedScenarios.map((scenario) => {
              const isNew = !renderedIds.current.has(scenario.id);
              return (
                <Area
                  key={scenario.id}
                  dataKey={scenario.id}
                  isAnimationActive={isNew}
                  fill={`var(--color-${scenario.id})`}
                  stroke={`var(--color-${scenario.id})`}
                />
              );
            })}

            {/* test data watermark */}
            <text
              className="left-2 text-2xl font-bold tracking-widest opacity-50 lg:text-5xl"
              x={window.innerWidth < 640 ? "60%" : "50%"}
              y={window.innerWidth < 640 ? "50%" : "50%"}
              textAnchor="middle"
            >
              TEST DATA
            </text>
          </AreaChart>
        </ChartContainer>

        <Accordion type="multiple" defaultValue={["scenarios"]}>
          {/* scenario selector */}
          <AccordionItem value="scenarios">
            <AccordionTrigger className="text-xl">Scenarios</AccordionTrigger>
            <AccordionContent>
              <div className="mt-4">
                <div className="flex flex-col items-end gap-4">
                  <ScenarioAreaButton
                    onClick={resetScenarios}
                    label="Reset scenarios"
                  />
                  <ScenarioAreaButton
                    onClick={selectAllScenarios}
                    label="Select all scenarios"
                  />
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                  {SCENARIOS.map((scenario) => (
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

        <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
          <p className="mb-2">References:</p>
          <ol className="list-inside list-decimal">
            <li>
              <a
                href="https://www.nature.com/articles/s41591-023-02521-2"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Nature Medicine: Long COVID burden and risk factors in 10 UK
                longitudinal studies and electronic health records
              </a>
            </li>
            <li>
              <a
                href="https://www.kff.org/coronavirus-covid-19/issue-brief/as-recommendations-for-isolation-end-how-common-is-long-covid/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                KFF: As Recommendations for Isolation End, How Common is Long
                COVID?
              </a>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
