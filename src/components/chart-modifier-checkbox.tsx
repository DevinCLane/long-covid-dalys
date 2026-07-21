import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

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
    <div className={cn("mb-2 flex items-center gap-2", className)}>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <p className="text-sm font-normal">{title}</p>
    </div>
  );
}
