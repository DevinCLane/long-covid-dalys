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
      aria-label="Interventions"
      value={value}
      onValueChange={handleValueChange}
      className={cn("flex flex-col text-left sm:w-126 sm:flex-row", className)}
    >
      {options.map((option) => (
        <Field
          key={option.value}
          orientation="horizontal"
          className="min-w-0 flex-1"
        >
          <FieldLabel className="w-full cursor-pointer rounded-sm px-3 py-2 text-sm font-normal sm:h-14 sm:gap-4">
            <RadioGroupItem value={option.value} />
            {option.label}
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
}
