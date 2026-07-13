import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

interface BreakdownCheckboxProps {
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function BreakdownCheckbox({
  className,
  checked,
  onCheckedChange,
}: BreakdownCheckboxProps) {
  return (
    <div className={cn("mb-2 flex items-center gap-2", className)}>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <p className="text-sm font-normal">Show breakdown by Acute, LC, PASC</p>
    </div>
  );
}
