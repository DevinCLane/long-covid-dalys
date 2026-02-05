"use client";

import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function CumulativeComparativeSwitcher({
  isComparativeMode,
  setIsComparativeMode,
}: {
  isComparativeMode?: boolean;
  setIsComparativeMode?: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="inline-flex h-9 rounded-md bg-input/50 p-0.5">
      <RadioGroup
        value={isComparativeMode ? "comparative" : "cumulative"}
        onValueChange={
          setIsComparativeMode
            ? (value) => setIsComparativeMode(value === "comparative")
            : undefined
        }
        className={`after:ease-&lsqb;cubic-bezier(0.16,1,0.3,1)&rsqb; group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:bg-card after:shadow-xs after:transition-transform after:duration-300 ${isComparativeMode ? "after:translate-x-0" : "after:translate-x-full"}`}
        data-state={isComparativeMode ? "comparative" : "cumulative"}
      >
        <label
          className={`relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors ${
            !isComparativeMode ? "text-muted-foreground/70" : ""
          }`}
        >
          <span className="hidden sm:inline">
            Compare between interventions
          </span>
          <span className="sm:hidden">Compare</span>
          <RadioGroupItem
            id={`${id}-1`}
            value="comparative"
            className="sr-only"
          />
        </label>
        <label
          className={`relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors ${
            isComparativeMode ? "text-muted-foreground/70" : ""
          }`}
        >
          <span className="hidden sm:inline">Cumulative interventions</span>
          <span className="sm:hidden">Total</span>
          <RadioGroupItem
            id={`${id}-2`}
            value="cumulative"
            className="sr-only"
          />
        </label>
      </RadioGroup>
    </div>
  );
}
