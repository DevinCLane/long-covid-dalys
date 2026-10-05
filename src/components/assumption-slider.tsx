import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface AssumptionSliderProps {
  className?: string;
  label?: string;
  sublabel?: string;
  unit?: "percent";
  minValue?: number;
  maxValue?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
}

export function AssumptionSlider({
  className,
  label,
  sublabel,
  unit,
  minValue = 0.0,
  maxValue = 2,
  step,
  value = 0.5,
  defaultValue = 0,
  disabled = false,
  onValueChange,
}: AssumptionSliderProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const inputId = `${id}-input`;
  const {
    inputValue,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
    validationMessage,
  } = useSliderWithInput({
    minValue,
    maxValue,
    step,
    value,
    defaultValue,
    onValueChange,
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="md:min-h-20">
          <Label id={labelId} htmlFor={inputId}>
            {label ?? "Assumption value"}
          </Label>
          {sublabel && (
            <p className="text-muted-foreground text-sm">{sublabel}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label={`Reset ${label ?? "assumption value"} to default`}
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
          <Input
            id={inputId}
            className="bg-card h-7 w-16 px-2 py-0"
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(event) => handleInputChange(event.target.value)}
            onBlur={() => validateAndUpdateValue(inputValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                validateAndUpdateValue(inputValue);
              }
            }}
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          thumbProps={{
            "aria-labelledby": labelId,
            "aria-describedby": descriptionId,
            "aria-valuetext": `${Number(value.toFixed(8))}${unit === "percent" ? " percent" : ""}`,
          }}
          className={cn("grow", "**:[[role='slider']]:bg-card")}
          value={[value]}
          onValueChange={(newValue) => {
            handleSliderChange(newValue);
          }}
          min={minValue}
          max={maxValue}
          step={step}
          disabled={disabled}
        />
      </div>
      <p id={descriptionId} className="sr-only">
        {sublabel} Allowed range: {minValue} to {maxValue}
        {unit === "percent" ? " percent" : ""}.
      </p>
      <p role="status" className="sr-only">
        {validationMessage}
      </p>
    </div>
  );
}
