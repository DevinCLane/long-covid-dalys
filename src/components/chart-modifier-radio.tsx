import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export interface RadioOption {
  label: string;
  value: "all" | "prophylaxis" | "longCovidMedication";
}

interface ChartModifierRadioProps {
  className?: string;
  options: RadioOption[];
  onValueChange: (value: RadioOption["value"]) => void;
  value: RadioOption["value"];
}

export function ChartModifierRadio({
  className,
  options,
  onValueChange,
  value,
}: ChartModifierRadioProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={cn(className)}
    >
      <Field className="flex sm:flex-row">
        {options.map((option) => (
          <FieldLabel
            key={option.value}
            className="cursor-pointer text-sm font-normal"
          >
            <RadioGroupItem value={option.value} />
            {option.label}
          </FieldLabel>
        ))}
      </Field>
    </RadioGroup>
  );
}
