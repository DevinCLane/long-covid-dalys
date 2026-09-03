import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type RadioOption = {
  label: string;
  value: "all" | "prophylaxis" | "longCovidMedication";
};

interface ChartModifierRadioProps {
  className?: string;
  options: RadioOption[];
  onValueChange: (value: string) => void;
  value: string;
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
      className={cn("w-fit", className)}
    >
      <Field orientation="horizontal">
        {options.map((option) => (
          <FieldLabel className="cursor-pointer text-sm font-normal">
            <RadioGroupItem value={option.value} />
            {option.label}
          </FieldLabel>
        ))}
      </Field>
    </RadioGroup>
  );
}
