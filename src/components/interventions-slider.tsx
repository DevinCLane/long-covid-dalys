import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterventionsSliderProps {
  className?: string;
  label?: string;
  sublabel?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  initialValue?: number[];
  defaultValue?: number[];
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
}

function InterventionsSlider({
  className,
  label,
  sublabel,
  minValue = 0.0,
  maxValue = 2,
  step,
  initialValue = [0.5],
  defaultValue = [0],
  disabled = false,
  onValueChange,
}: InterventionsSliderProps) {
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
  } = useSliderWithInput({
    minValue,
    maxValue,
    initialValue,
    defaultValue,
    onValueChange,
  });

  return (
    <div className={cn("min-w-[300px] space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Label>{label}</Label>
          {sublabel && (
            <p className="text-sm text-muted-foreground">{sublabel}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Reset"
                  onClick={resetToDefault}
                  disabled={disabled}
                >
                  <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                Reset to default
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            className="h-7 w-12 px-2 py-0"
            type="text"
            inputMode="decimal"
            value={inputValues[0]}
            onChange={(e) => handleInputChange(e, 0)}
            onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                validateAndUpdateValue(inputValues[0], 0);
              }
            }}
            disabled={disabled}
            aria-label="Enter value"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          className="grow"
          value={sliderValue}
          onValueChange={(newValue) => {
            handleSliderChange(newValue);
            onValueChange?.(newValue);
          }}
          min={minValue}
          max={maxValue}
          step={step}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export { InterventionsSlider };
