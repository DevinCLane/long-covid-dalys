import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldLabel } from "./ui/field";

interface ChartModifierCheckbox {
  className?: string;
  title?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ChartModifierCheckbox({
  className,
  title,
  checked,
  onCheckedChange,
}: ChartModifierCheckbox) {
  return (
    <Field orientation="horizontal" className={cn(className)}>
      <FieldLabel className="cursor-pointer text-sm font-normal">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="border-foreground"
        />
        {title}
      </FieldLabel>
    </Field>
  );
}
