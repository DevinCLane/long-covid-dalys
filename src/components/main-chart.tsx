"use client";

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
import { SCENARIOS } from "@/config/scenarios";

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
  const [selectedScenarios, setSelectedScenarios] = React.useState<Set<string>>(
    () =>
      new Set(
        SCENARIOS.filter((scenario) => scenario.checked).map(
          (scenario) => scenario.id,
        ),
      ),
  );

  // create a new set each time so react knows to update
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

  // chart config is created based on selected scenarios
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

  return (
    <Card>
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

            <text
              className="left-2 text-2xl font-bold tracking-widest opacity-50 lg:text-5xl"
              x={window.innerWidth < 640 ? "60%" : "50%"}
              y={window.innerWidth < 640 ? "50%" : "50%"}
              textAnchor="middle"
            >
              TEST DATA
            </text>

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
            {SCENARIOS.filter((scenario) =>
              selectedScenarios.has(scenario.id),
            ).map((scenario) => (
              <Area
                key={scenario.id}
                dataKey={scenario.id}
                type="monotone"
                fill={`var(--color-${scenario.id})`}
                stroke={`var(--color-${scenario.id})`}
              />
            ))}
          </AreaChart>
        </ChartContainer>
        <div className="mt-4">
          <div className="m-2 text-xl font-medium">Scenarios</div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
            {SCENARIOS.map((scenario) => (
              <ScenarioArea
                key={scenario.id}
                id={scenario.id}
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
