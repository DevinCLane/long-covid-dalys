"use client";

import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ASSUMPTIONS,
  ASSUMPTIONS_BY_KEY,
  DEFAULT_ASSUMPTION_VALUES,
  getAssumptionSliderMax,
  type AssumptionKey,
  type AssumptionValues,
} from "@/config/assumptions";
import { calculateScenarioDalyRows } from "@/config/scenario-daly-calculations";
import { DalyModelContext } from "@/hooks/use-daly-model";

export function DalyModelProvider({ children }: { children: ReactNode }) {
  const [assumptions, setAssumptions] = useState<AssumptionValues>(() => ({
    ...DEFAULT_ASSUMPTION_VALUES,
  }));
  const deferredAssumptions = useDeferredValue(assumptions);

  const setAssumption = useCallback((key: AssumptionKey, value: number) => {
    setAssumptions((current) => {
      const definition = ASSUMPTIONS_BY_KEY[key];
      const finiteValue = Number.isFinite(value)
        ? value
        : definition.defaultValue;
      const maximum = getAssumptionSliderMax(key, current);
      const nextValue = Math.min(
        maximum,
        Math.max(definition.sliderMin, finiteValue),
      );

      if (current[key] === nextValue) return current;
      return { ...current, [key]: nextValue };
    });
  }, []);

  const scenarioRows = useMemo(
    () => calculateScenarioDalyRows(deferredAssumptions),
    [deferredAssumptions],
  );

  // Match the watermark to the assumptions used by the displayed chart data.
  const isCustomScenario = ASSUMPTIONS.some(
    ({ key, defaultValue }) => deferredAssumptions[key] !== defaultValue,
  );

  const resetAll = useCallback(
    () => setAssumptions({ ...DEFAULT_ASSUMPTION_VALUES }),
    [],
  );

  const contextValue = useMemo(
    () => ({
      assumptions,
      scenarioRows,
      isCustomScenario,
      setAssumption,
      resetAll,
    }),
    [assumptions, scenarioRows, isCustomScenario, setAssumption, resetAll],
  );

  return (
    <DalyModelContext.Provider value={contextValue}>
      {children}
    </DalyModelContext.Provider>
  );
}
