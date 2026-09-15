import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface RadioOption<T extends string> {
  label: string;
  value: T;
}

interface ChartModifierRadioProps<T extends string> {
  className?: string;
  options: RadioOption<T>[];
  onValueChange: (value: T) => void;
  value: T;
}

export function ChartModifierRadio<T extends string>({
  className,
  options,
  onValueChange,
  value,
}: ChartModifierRadioProps<T>) {
  function handleValueChange(incomingStr: string) {
    const matchedOption = options.find(
      (option) => option.value === incomingStr,
    );
    if (matchedOption) {
      onValueChange(matchedOption.value);
    }
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={handleValueChange}
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
