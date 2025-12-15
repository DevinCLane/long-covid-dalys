// takes in name for the scenario
// checkbox to click
// logic for what happens to checkbox?

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Scenario } from "@/config/scenarios";

interface ScenarioAreaProps extends Scenario {
  onCheckedChange: (checked: boolean) => void;
}

export function ScenarioArea({
  id,
  label,
  DALYs,
  infected,
  sublabel,
  checked,
  onCheckedChange,
}: ScenarioAreaProps) {
  return (
    <div className="m-4 flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <div className="flex gap-4">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
        <div className="text-sm">
          {DALYs} DALYs per 1000 people over 10 years
        </div>
        <div className="text-sm">~{infected}% infected annually</div>
        <div>
          {sublabel && (
            <p className="text-start text-sm text-muted-foreground">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
