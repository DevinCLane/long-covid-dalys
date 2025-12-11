// takes in name for the scenario
// checkbox to click
// logic for what happens to checkbox?

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ScenarioAreaProps {
  id: string;
  label: string;
  //   isChecked: boolean;
  sublabel?: string;
}

export function ScenarioArea({ id, label, sublabel }: ScenarioAreaProps) {
  return (
    <div className="m-4 flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <div className="flex gap-4">
          <Checkbox id={id} />
          <Label htmlFor={id}>{label}</Label>
        </div>
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
