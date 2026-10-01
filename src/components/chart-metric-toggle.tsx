import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Field, FieldLabel } from "./ui/field";

export type ChartMetric = "percent" | "dalys";

interface ChartMetricToggleProps {
  value: ChartMetric;
  onValueChange: (value: ChartMetric) => void;
}

export function ChartMetricToggle({
  value,
  onValueChange,
}: ChartMetricToggleProps) {
  const fieldLabelStyles =
    "h-full min-h-11 w-full cursor-pointer gap-2 rounded-sm px-3 py-2 text-sm font-normal";
  const fieldStyles = "min-w-0 max-w-full sm:w-auto sm:flex-none";

  function handleValueChange(value: ChartMetric) {
    onValueChange(value);
  }
  return (
    <RadioGroup
      aria-label="Show values as"
      onValueChange={handleValueChange}
      value={value}
      className="flex w-full max-w-full min-w-0 flex-col gap-2 text-left sm:w-fit sm:flex-none sm:flex-row sm:flex-wrap"
    >
      <Field orientation="horizontal" className={fieldStyles}>
        <Tooltip>
          <TooltipTrigger asChild>
            <FieldLabel className={fieldLabelStyles}>
              <RadioGroupItem value="percent" />
              <span className="min-w-0 break-words">Percent reduction</span>
            </FieldLabel>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 px-2 py-1 text-xs">
            Percent reduction compared with the status quo scenario of no
            population-level health interventions. Negative values indicate
            increased DALYs.
          </TooltipContent>
        </Tooltip>
      </Field>
      <Field orientation="horizontal" className={fieldStyles}>
        <FieldLabel className={fieldLabelStyles}>
          <RadioGroupItem value="dalys" />
          <span className="min-w-0 break-words">DALYs per 1,000</span>
        </FieldLabel>
      </Field>
    </RadioGroup>
  );
}
