import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ResetView({ resetView }: { resetView: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Reset view to default"
          className="bg-card"
          onClick={resetView}
          // disabled={disabled}
        >
          <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        Reset view to default
      </TooltipContent>
    </Tooltip>
  );
}
