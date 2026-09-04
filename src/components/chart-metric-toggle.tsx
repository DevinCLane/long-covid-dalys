import { Button } from "@/components/ui/button";

export type ChartMetric = "percent" | "dalys";

interface ChartMetricToggleProps {
  value: ChartMetric;
  onValueChange: (value: ChartMetric) => void;
  disabled?: boolean;
}

export function ChartMetricToggle({
  value,
  onValueChange,
  disabled,
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
        variant={value === "percent" ? "default" : "ghost"}
        aria-pressed={value === "percent"}
        onClick={() => onValueChange("percent")}
        className="cursor-pointer"
        disabled={disabled}
      >
        Percent reduction
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "dalys" ? "default" : "ghost"}
        aria-pressed={value === "dalys"}
        onClick={() => onValueChange("dalys")}
        className="cursor-pointer"
      >
        DALYs per 1,000
      </Button>
    </div>
  );
}
