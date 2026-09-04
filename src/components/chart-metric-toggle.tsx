import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block w-fit">
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
          </span>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent className="px-2 py-1 text-xs">
            Status quo has 0% reduction relative to itself
          </TooltipContent>
        )}
      </Tooltip>
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
