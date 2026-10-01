import type { ChartMetric } from "@/components/chart-metric-toggle";

// Include zero and leave space for labels at either end of signed bars.
export function dalysAvertedAxisDomain([dataMin, dataMax]: readonly [
  number,
  number,
]): [number, number] {
  const magnitude = Math.max(1, Math.abs(dataMin), Math.abs(dataMax));
  const step = 10 ** Math.floor(Math.log10(magnitude)) / 2;
  return [
    Math.floor((Math.min(0, dataMin) * 1.15) / step) * step,
    Math.max(step, Math.ceil((Math.max(0, dataMax) * 1.1) / step) * step),
  ];
}

// Shared by the three intervention charts so every displayed value uses the
// same metric, including sorting, tooltips, and original-value markers.
export function scenarioChartMetric(metric: ChartMetric, isMobile: boolean) {
  switch (metric) {
    case "percent":
      return {
        dataKey: "percent_reduction" as const,
        axisLabel: isMobile
          ? "DALY reduction (%)"
          : "Reduction in total DALYs vs default status quo (%)",
        tooltipLabel: "Total DALY reduction",
      };
    case "dalys":
      return {
        dataKey: "total" as const,
        axisLabel: "Total DALYs per 1,000 people",
        tooltipLabel: "Total DALYs per 1,000",
      };
    case "averted":
      return {
        dataKey: "dalys_averted" as const,
        axisLabel: "DALYs averted per 1,000 people",
        tooltipLabel: "Total DALYs averted per 1,000",
      };
  }
}
