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
const chartData = [
    { date: "2025-01-01", nointervention: 15000000, intervention: 12000000 },
    { date: "2029-01-01", nointervention: 12500000, intervention: 8000000 },
    { date: "2034-01-01", nointervention: 10000000, intervention: 5000000 },
    { date: "2049-01-01", nointervention: 8000000, intervention: 2000000 },
    { date: "2074-01-01", nointervention: 5000000, intervention: 500000 },
    { date: "2124-01-01", nointervention: 2000000, intervention: 100000 },
];

const chartConfig = {
    longcovidcases: {
        label: "Long Covid cases",
    },
    nointervention: {
        label: "No intervention",
        color: "hsl(var(--chart-1))",
    },
    intervention: {
        label: "Intervention",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function MainChart() {
    const [timeRange, setTimeRange] = React.useState("5y");

    const filteredData = chartData.filter((item) => {
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
                    <CardTitle>Long Covid cases</CardTitle>
                    <CardDescription>
                        Showing total cases of long covid and disease burden as
                        measured in Disability-adjusted life years (DALYs).
                    </CardDescription>
                    <CardDescription>
                        <a
                            href="https://en.wikipedia.org/wiki/Disability-adjusted_life_year"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            What's a DALY?{" "}
                        </a>
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select projection range"
                    >
                        <SelectValue placeholder="5 year projection" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillnointervention"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-nointervention)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-nointervention)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillintervention"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-intervention)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-intervention)"
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
                            axisLine={false}
                            width={75}
                            tick={{ width: 250 }}
                            tickMargin={8}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="intervention"
                            type="natural"
                            fill="url(#fillintervention)"
                            stroke="var(--color-intervention)"
                            stackId="a"
                        />
                        <Area
                            dataKey="nointervention"
                            type="natural"
                            fill="url(#fillnointervention)"
                            stroke="var(--color-nointervention)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
