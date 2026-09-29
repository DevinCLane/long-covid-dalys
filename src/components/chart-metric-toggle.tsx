import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Field, FieldLabel } from "./ui/field";

export type ChartMetric = "percent" | "dalys";

interface ChartMetricToggleProps {
  value: ChartMetric;
  onValueChange: (value: ChartMetric) => void;
  disabled?: boolean;
}

export function ChartMetricToggle({
  value,
  onValueChange,
}: ChartMetricToggleProps) {
  const fieldLabelStyles =
    "cursor-pointer rounded-sm px-2 py-2 text-sm font-normal sm:gap-4";
  function handleValueChange(value: ChartMetric) {
    onValueChange(value);
  }
  return (
    <RadioGroup
      aria-label="Chart metric"
      className="flex items-center text-left sm:min-h-14 sm:w-90"
      onValueChange={handleValueChange}
      value={value}
    >
      <Field>
        <Tooltip>
          <TooltipTrigger asChild>
            <FieldLabel className={fieldLabelStyles}>
              <RadioGroupItem value="percent" />
              Percent reduction
            </FieldLabel>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 px-2 py-1 text-xs">
            Percent reduction compared with the status quo scenario of no
            population-level health interventions. Negative values indicate
            increased DALYs.
          </TooltipContent>
        </Tooltip>
      </Field>
      <Field>
        <FieldLabel className={fieldLabelStyles}>
          <RadioGroupItem value="dalys" />
          DALYs per 1,000
        </FieldLabel>
      </Field>
    </RadioGroup>
  );
}
