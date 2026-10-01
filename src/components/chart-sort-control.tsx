import { ChartControlGroup } from "./chart-control-group";
import { Button } from "@/components/ui/button";
import type { ChartSortProps } from "@/lib/chart-sort";

export function ChartSortControl({ sortOrder, setSortOrder }: ChartSortProps) {
  return (
    <ChartControlGroup label="Sort order">
      <div
        role="group"
        aria-label="Sort chart by displayed value"
        className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto"
      >
        <Button
          type="button"
          variant={sortOrder === "descending" ? "secondary" : "outline"}
          aria-pressed={sortOrder === "descending"}
          aria-label="Sort high to low"
          className="min-h-11 flex-1 px-3 sm:flex-none"
          onClick={() => setSortOrder("descending")}
        >
          High → low
        </Button>
        <Button
          type="button"
          variant={sortOrder === "ascending" ? "secondary" : "outline"}
          aria-pressed={sortOrder === "ascending"}
          aria-label="Sort low to high"
          className="min-h-11 flex-1 px-3 sm:flex-none"
          onClick={() => setSortOrder("ascending")}
        >
          Low → high
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 flex-1 px-3 sm:flex-none"
          disabled={sortOrder === "default"}
          onClick={() => setSortOrder("default")}
        >
          Reset order
        </Button>
      </div>
    </ChartControlGroup>
  );
}
