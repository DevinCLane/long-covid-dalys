import { createContext, useContext } from "react";

import type { AssumptionKey, AssumptionValues } from "@/config/assumptions";
import type { ScenarioDalyRow } from "@/config/scenario-daly-calculations";

export type DalyModelContextValue = {
  assumptions: AssumptionValues;
  scenarioRows: ScenarioDalyRow[];
  setAssumption: (key: AssumptionKey, value: number) => void;
};

export const DalyModelContext = createContext<DalyModelContextValue | null>(
  null,
);

export function useDalyModel() {
  const context = useContext(DalyModelContext);
  if (!context) {
    throw new Error("useDalyModel must be used within a DalyModelProvider");
  }
  return context;
}
