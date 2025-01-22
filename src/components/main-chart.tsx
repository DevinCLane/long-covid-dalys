"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
    { date: "2024-04-01", nointervention: 222, intervention: 150 },
    { date: "2024-04-02", nointervention: 97, intervention: 180 },
    { date: "2024-04-03", nointervention: 167, intervention: 120 },
    { date: "2024-04-04", nointervention: 242, intervention: 260 },
    { date: "2024-04-05", nointervention: 373, intervention: 290 },
    { date: "2024-04-06", nointervention: 301, intervention: 340 },
    { date: "2024-04-07", nointervention: 245, intervention: 180 },
    { date: "2024-04-08", nointervention: 409, intervention: 320 },
    { date: "2024-04-09", nointervention: 59, intervention: 110 },
    { date: "2024-04-10", nointervention: 261, intervention: 190 },
    { date: "2024-04-11", nointervention: 327, intervention: 350 },
    { date: "2024-04-12", nointervention: 292, intervention: 210 },
    { date: "2024-04-13", nointervention: 342, intervention: 380 },
    { date: "2024-04-14", nointervention: 137, intervention: 220 },
    { date: "2024-04-15", nointervention: 120, intervention: 170 },
    { date: "2024-04-16", nointervention: 138, intervention: 190 },
    { date: "2024-04-17", nointervention: 446, intervention: 360 },
    { date: "2024-04-18", nointervention: 364, intervention: 410 },
    { date: "2024-04-19", nointervention: 243, intervention: 180 },
    { date: "2024-04-20", nointervention: 89, intervention: 150 },
    { date: "2024-04-21", nointervention: 137, intervention: 200 },
    { date: "2024-04-22", nointervention: 224, intervention: 170 },
    { date: "2024-04-23", nointervention: 138, intervention: 230 },
    { date: "2024-04-24", nointervention: 387, intervention: 290 },
    { date: "2024-04-25", nointervention: 215, intervention: 250 },
    { date: "2024-04-26", nointervention: 75, intervention: 130 },
    { date: "2024-04-27", nointervention: 383, intervention: 420 },
    { date: "2024-04-28", nointervention: 122, intervention: 180 },
    { date: "2024-04-29", nointervention: 315, intervention: 240 },
    { date: "2024-04-30", nointervention: 454, intervention: 380 },
    { date: "2024-05-01", nointervention: 165, intervention: 220 },
    { date: "2024-05-02", nointervention: 293, intervention: 310 },
    { date: "2024-05-03", nointervention: 247, intervention: 190 },
    { date: "2024-05-04", nointervention: 385, intervention: 420 },
    { date: "2024-05-05", nointervention: 481, intervention: 390 },
    { date: "2024-05-06", nointervention: 498, intervention: 520 },
    { date: "2024-05-07", nointervention: 388, intervention: 300 },
    { date: "2024-05-08", nointervention: 149, intervention: 210 },
    { date: "2024-05-09", nointervention: 227, intervention: 180 },
    { date: "2024-05-10", nointervention: 293, intervention: 330 },
    { date: "2024-05-11", nointervention: 335, intervention: 270 },
    { date: "2024-05-12", nointervention: 197, intervention: 240 },
    { date: "2024-05-13", nointervention: 197, intervention: 160 },
    { date: "2024-05-14", nointervention: 448, intervention: 490 },
    { date: "2024-05-15", nointervention: 473, intervention: 380 },
    { date: "2024-05-16", nointervention: 338, intervention: 400 },
    { date: "2024-05-17", nointervention: 499, intervention: 420 },
    { date: "2024-05-18", nointervention: 315, intervention: 350 },
    { date: "2024-05-19", nointervention: 235, intervention: 180 },
    { date: "2024-05-20", nointervention: 177, intervention: 230 },
    { date: "2024-05-21", nointervention: 82, intervention: 140 },
    { date: "2024-05-22", nointervention: 81, intervention: 120 },
    { date: "2024-05-23", nointervention: 252, intervention: 290 },
    { date: "2024-05-24", nointervention: 294, intervention: 220 },
    { date: "2024-05-25", nointervention: 201, intervention: 250 },
    { date: "2024-05-26", nointervention: 213, intervention: 170 },
    { date: "2024-05-27", nointervention: 420, intervention: 460 },
    { date: "2024-05-28", nointervention: 233, intervention: 190 },
    { date: "2024-05-29", nointervention: 78, intervention: 130 },
    { date: "2024-05-30", nointervention: 340, intervention: 280 },
    { date: "2024-05-31", nointervention: 178, intervention: 230 },
    { date: "2024-06-01", nointervention: 178, intervention: 200 },
    { date: "2024-06-02", nointervention: 470, intervention: 410 },
    { date: "2024-06-03", nointervention: 103, intervention: 160 },
    { date: "2024-06-04", nointervention: 439, intervention: 380 },
    { date: "2024-06-05", nointervention: 88, intervention: 140 },
    { date: "2024-06-06", nointervention: 294, intervention: 250 },
    { date: "2024-06-07", nointervention: 323, intervention: 370 },
    { date: "2024-06-08", nointervention: 385, intervention: 320 },
    { date: "2024-06-09", nointervention: 438, intervention: 480 },
    { date: "2024-06-10", nointervention: 155, intervention: 200 },
    { date: "2024-06-11", nointervention: 92, intervention: 150 },
    { date: "2024-06-12", nointervention: 492, intervention: 420 },
    { date: "2024-06-13", nointervention: 81, intervention: 130 },
    { date: "2024-06-14", nointervention: 426, intervention: 380 },
    { date: "2024-06-15", nointervention: 307, intervention: 350 },
    { date: "2024-06-16", nointervention: 371, intervention: 310 },
    { date: "2024-06-17", nointervention: 475, intervention: 520 },
    { date: "2024-06-18", nointervention: 107, intervention: 170 },
    { date: "2024-06-19", nointervention: 341, intervention: 290 },
    { date: "2024-06-20", nointervention: 408, intervention: 450 },
    { date: "2024-06-21", nointervention: 169, intervention: 210 },
    { date: "2024-06-22", nointervention: 317, intervention: 270 },
    { date: "2024-06-23", nointervention: 480, intervention: 530 },
    { date: "2024-06-24", nointervention: 132, intervention: 180 },
    { date: "2024-06-25", nointervention: 141, intervention: 190 },
    { date: "2024-06-26", nointervention: 434, intervention: 380 },
    { date: "2024-06-27", nointervention: 448, intervention: 490 },
    { date: "2024-06-28", nointervention: 149, intervention: 200 },
    { date: "2024-06-29", nointervention: 103, intervention: 160 },
    { date: "2024-06-30", nointervention: 446, intervention: 400 },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
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
    const [timeRange, setTimeRange] = React.useState("90d");

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
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
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
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
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
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
