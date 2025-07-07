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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { InterventionsSlider } from "@/components/interventions-slider";

const generateChartData = () => {
  const data = [];
  let baselineCases = 17000000; // Starting with 17M cases
  const yearlyReduction = 0.98; // 2% reduction per year
  // 80 DALYs per 1k people with LC
  const dalysPer1000People = 80;

  for (let year = 2025; year <= 2125; year++) {
    // convert LC cases to DALYs
    const totalDALYs = (baselineCases * dalysPer1000People) / 1000;
    data.push({
      date: `${year}-01-01`,
      dalys: Math.round(totalDALYs),
    });
    baselineCases *= yearlyReduction; // Reduce by 2% each year
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  dalys: {
    label: "Million DALYs per year",
    color: "hsl(var(--chart-1))",
  },
  interventionDalys: {
    label: "With interventions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const calculateReducedDALYs = (
  baseData: typeof chartData,
  interventions: Record<string, boolean>,
  interventionValues: Record<string, number>,
) => {
  const reductionFactor = Object.entries(interventions).reduce(
    (acc, [key, value]) => {
      if (value) {
        const sliderValue = interventionValues[key];
        switch (key) {
          case "sickLeave":
            return acc + (sliderValue / 52) * 0.1; // 10% reduction
          case "ventilation":
            return acc + (sliderValue / 100) * 0.15; // 15% reduction
          case "masks":
            return acc + (sliderValue / 100) * 0.2; // 20% reduction
          case "pharmaceuticalprevention":
            return acc + (sliderValue / 100) * 0.25; // 25% reduction
          case "vaccination":
            return acc + (sliderValue / 100) * 0.3; // 30% reduction
          case "testing":
            return acc + (sliderValue / 100) * 0.1; // 10% reduction
          default:
            return acc;
        }
      }
      return acc;
    },
    0,
  );
  return baseData.map((item) => ({
    date: item.date,
    dalys: Math.round(item.dalys * (1 - reductionFactor)),
  }));
};

export function LCDALYs() {
  const [timeRange, setTimeRange] = React.useState("5y");
  const [interventions, setInterventions] = React.useState({
    sickLeave: false,
    ventilation: false,
    testing: false,
    masks: false,
    pharmaceuticalprevention: false,
    vaccination: false,
  });

  const [interventionValues, setInterventionValues] = React.useState({
    sickLeave: 0,
    ventilation: 0,
    testing: 0,
    masks: 0,
    pharmaceuticalprevention: 0,
    vaccination: 0,
  });

  const handleInterventionChange = (id: string, checked: boolean) => {
    setInterventions((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSliderValueChange = (id: string, value: number[]) => {
    setInterventionValues((prev) => ({
      ...prev,
      [id]: value[0],
    }));
  };

  const filteredData = chartData
    .map((baselineItem) => {
      const date = baselineItem.date;
      const interventionDalys = calculateReducedDALYs(
        [baselineItem],
        interventions,
        interventionValues,
      )[0].dalys;

      return {
        date,
        dalys: baselineItem.dalys,
        interventionDalys,
      };
    })
    .filter((item) => {
      const date = new Date(item.date);
      const startDate = new Date("2025-01-01");
      let endDate = new Date("2029-01-01");

      switch (timeRange) {
        case "10y":
          endDate = new Date("2034-01-01");
          break;
        case "25y":
          endDate = new Date("2049-01-01");
          break;
        case "50y":
          endDate = new Date("2074-01-01");
          break;
        case "100y":
          endDate = new Date("2124-01-01");
          break;
      }
      return date >= startDate && date <= endDate;
    });

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
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-auto rounded-lg bg-card sm:ml-auto"
            aria-label="Select projection range"
          >
            <SelectValue placeholder="5 year projection" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card">
            <SelectItem value="5y" className="rounded-lg">
              5 Year Projection
            </SelectItem>
            <SelectItem value="10y" className="rounded-lg">
              10 Year Projection
            </SelectItem>
            <SelectItem value="25y" className="rounded-lg">
              25 Year Projection
            </SelectItem>
            <SelectItem value="50y" className="rounded-lg">
              50 Year Projection
            </SelectItem>
            <SelectItem value="100y" className="rounded-lg">
              100 Year Projection
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[1050px] w-full md:h-[700px]"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="filldalys" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dalys)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dalys)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillInterventionDalys"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-interventionDalys)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-interventionDalys)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                });
              }}
            />
            <YAxis
              dataKey="dalys"
              axisLine={false}
              width={85}
              tick={{ width: 250 }}
              tickMargin={8}
              // 17M cases * 80 DALYs / 1000
              domain={[0, 1360000]}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}M  `}
              allowDataOverflow={false}
              label={{
                value: "Million DALYs per year",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-card"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="dalys"
              type="natural"
              fill="url(#filldalys)"
              stroke="var(--color-dalys)"
            />
            <Area
              dataKey="interventionDalys"
              type="natural"
              fill="url(#fillInterventionDalys)"
              stroke="var(--color-interventionDalys)"
            />
            <ChartLegend
              content={
                <>
                  <ChartLegendContent />
                  <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="sickLeave"
                        checked={interventions.sickLeave}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            "sickLeave",
                            checked as boolean,
                          )
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label htmlFor="sickLeave" className="sr-only">
                          Paid sick leave
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Paid Sick Leave"
                            sublabel="Mandatory paid sick leave for workers with COVID-19
                          symptoms, in weeks"
                            minValue={0}
                            maxValue={52}
                            step={1}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.sickLeave}
                            onValueChange={(value) =>
                              handleSliderValueChange("sickLeave", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="ventilation"
                        checked={interventions.ventilation}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            "ventilation",
                            checked as boolean,
                          )
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label htmlFor="ventilation" className="sr-only">
                          Improved ventilation in schools
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Air Quality Improvements"
                            sublabel="Percentage of buildings with effective air filtration, ventilation, and far germicial UVC"
                            minValue={0}
                            maxValue={100}
                            step={5}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.ventilation}
                            onValueChange={(value) =>
                              handleSliderValueChange("ventilation", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="testing"
                        checked={interventions.testing}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            "testing",
                            checked as boolean,
                          )
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label htmlFor="testing" className="sr-only">
                          Testing and isolation
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Testing Coverage"
                            sublabel="Percentage of symptomatic individuals tested"
                            minValue={0}
                            maxValue={100}
                            step={5}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.testing}
                            onValueChange={(value) =>
                              handleSliderValueChange("testing", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="vaccination"
                        checked={interventions.vaccination}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            "vaccination",
                            checked as boolean,
                          )
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label htmlFor="vaccination" className="sr-only">
                          Vaccination
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Vaccination Coverage"
                            sublabel="Percentage of population with up-to-date vaccination"
                            minValue={0}
                            maxValue={100}
                            step={5}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.vaccination}
                            onValueChange={(value) =>
                              handleSliderValueChange("vaccination", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="masks"
                        checked={interventions.masks}
                        onCheckedChange={(checked) =>
                          handleInterventionChange("masks", checked as boolean)
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label htmlFor="masks" className="sr-only">
                          Masking
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Masking Adoption"
                            sublabel="Percentage of population wearing effective masks"
                            minValue={0}
                            maxValue={100}
                            step={5}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.masks}
                            onValueChange={(value) =>
                              handleSliderValueChange("masks", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-x-4 text-left">
                      <Checkbox
                        id="pharmaceutical-prevention"
                        checked={interventions.pharmaceuticalprevention}
                        onCheckedChange={(checked) =>
                          handleInterventionChange(
                            "pharmaceuticalprevention",
                            checked as boolean,
                          )
                        }
                      />
                      <div className="grid w-full gap-0.5 leading-none">
                        <label
                          htmlFor="pharmaceutical-prevention"
                          className="sr-only"
                        >
                          Pharmaceutical infection prevention
                        </label>
                        <div className="w-[90%]">
                          <InterventionsSlider
                            label="Pharmaceutical Prevention"
                            sublabel="Percentage of population using preventive measures such as nasal sprays and PrEP"
                            minValue={0}
                            maxValue={100}
                            step={5}
                            initialValue={[0]}
                            defaultValue={[0]}
                            disabled={!interventions.pharmaceuticalprevention}
                            onValueChange={(value) =>
                              handleSliderValueChange(
                                "pharmaceuticalprevention",
                                value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
          </AreaChart>
        </ChartContainer>
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
