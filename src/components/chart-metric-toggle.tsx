import { Button } from "@/components/ui/button";

export type ChartMetric = "percent" | "dalys";

interface ChartMetricToggleProps {
  value: ChartMetric;
  onValueChange: (value: ChartMetric) => void;
}

export function ChartMetricToggle({
  value,
  onValueChange,
}: ChartMetricToggleProps) {
  return (
    <div
      role="group"
      aria-label="Chart metric"
      className="bg-muted inline-flex rounded-lg p-1"
    >
      <Button
        type="button"
        size="sm"
        variant={value === "percent" ? "secondary" : "ghost"}
        aria-pressed={value === "percent"}
        onClick={() => onValueChange("percent")}
      >
        Percent reduction
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "dalys" ? "secondary" : "ghost"}
        aria-pressed={value === "dalys"}
        onClick={() => onValueChange("dalys")}
      >
        DALYs per 1,000
      </Button>
    </div>
  );
}
