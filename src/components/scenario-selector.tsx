"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCENARIOS, Scenario } from "@/config/scenarios";

interface ScenarioSelectorProps {
  selectedScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
}

export function ScenarioSelector({
  selectedScenario,
  onScenarioChange,
}: ScenarioSelectorProps) {
  const handleValueChange = (value: string) => {
    const scenario = SCENARIOS.find((s) => s.key === value);
    if (scenario) {
      onScenarioChange(scenario);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Air Cleaning Scenario</label>
      <Select value={selectedScenario.key} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a scenario">
            {selectedScenario.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SCENARIOS.map((scenario) => (
            <SelectItem key={scenario.key} value={scenario.key}>
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">{scenario.label}</span>
                <span className="text-xs text-muted-foreground">
                  {scenario.description}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {scenario.dalysPer1000} DALYs per 1,000 people (10 years)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="font-medium">Selected:</span>{" "}
          {selectedScenario.label}
        </p>
        <p>
          {selectedScenario.dalysPer1000} DALYs per 1,000 people over 10 years
        </p>
        <p className="text-xs">{selectedScenario.description}</p>
      </div>
    </div>
  );
}
