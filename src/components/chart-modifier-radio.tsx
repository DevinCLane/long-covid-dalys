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
      className={cn(
        "flex w-full max-w-full min-w-0 flex-col gap-2 text-left sm:w-fit sm:flex-none sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      {options.map((option) => (
        <Field
          key={option.value}
          orientation="horizontal"
          className="max-w-full min-w-0 sm:w-auto sm:flex-none"
        >
          <FieldLabel className="h-full min-h-11 w-full cursor-pointer gap-2 rounded-sm px-3 py-2 text-sm font-normal">
            <RadioGroupItem value={option.value} />
            <span className="min-w-0 break-words">{option.label}</span>
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
}
