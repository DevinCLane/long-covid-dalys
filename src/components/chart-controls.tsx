import type { ReactNode } from "react";
import { ChartMetricToggle, type ChartMetric } from "./chart-metric-toggle";
import { ChartSortControl } from "./chart-sort-control";
import type { ChartSortProps } from "@/lib/chart-sort";

interface ChartControlsProps extends ChartSortProps {
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
  interventions?: ReactNode;
}

export function ChartControls({
  metric,
  setMetric,
  sortOrder,
  setSortOrder,
  interventions,
}: ChartControlsProps) {
  return (
    <div
      data-slot="chart-controls"
      className="order-3 mt-4 mb-2 grid w-full min-w-0 gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto] md:order-1 md:mt-0 md:mb-4"
    >
      <div className="min-w-0">
        <ChartMetricToggle value={metric} onValueChange={setMetric} />
      </div>
      <div className="min-w-0 sm:justify-self-end">
        <ChartSortControl sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
      {interventions && (
        <div className="min-w-0 sm:col-span-2">{interventions}</div>
      )}
    </div>
  );
}
