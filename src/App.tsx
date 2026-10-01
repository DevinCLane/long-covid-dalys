// import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import TabsArea from "./components/tabs-area";
import { useEffect, useRef, useState } from "react";
import { AirId, PARENT_ORIGIN, TabId } from "./config/iframe-messages";
import { ChartMetric } from "./components/chart-metric-toggle";
import { ScenarioId } from "./config/scenario-daly-calculations";
import type { ChartSortOrder } from "./lib/chart-sort";

export type ChartTabId = Exclude<TabId, "about">;

const DEFAULT_SORT_ORDERS: Record<ChartTabId, ChartSortOrder> = {
  air: "default",
  prophylaxis: "default",
  longCovidMedication: "default",
  outcomeBreakdown: "default",
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("air");
  const [metric, setMetric] = useState<ChartMetric>("percent");
  const [airInterventionFilter, setAirInterventionFilter] =
    useState<AirId>("all");
  const [outcomeBreakdownScenarioId, setOutcomeBreakdownScenarioId] =
    useState<ScenarioId>("hepa_all_public");
  const outerDiv = useRef<HTMLDivElement>(null);
  const [sortOrders, setSortOrders] = useState(DEFAULT_SORT_ORDERS);

  function setChartSortOrder(tab: ChartTabId, sortOrder: ChartSortOrder) {
    setSortOrders((previous) => ({ ...previous, [tab]: sortOrder }));
  }

  function resetView() {
    setActiveTab("air");
    setMetric("percent");
    setAirInterventionFilter("all");
    setOutcomeBreakdownScenarioId("hepa_all_public");
    setSortOrders(DEFAULT_SORT_ORDERS);
    // ask iframe parent to reset url parameters
    window.parent.postMessage({ type: "dalys-reset-view" }, PARENT_ORIGIN);
    return;
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const clientHeight = entry.target.clientHeight;
        if (clientHeight) {
          window.parent.postMessage(
            { type: "dalys-resize", height: clientHeight },
            PARENT_ORIGIN,
          );
        }
      }
    });

    if (!outerDiv.current) {
      return;
    }
    resizeObserver.observe(outerDiv.current);

    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div
      ref={outerDiv}
      className="mx-auto flex flex-col px-4 py-2 text-center md:px-8 md:py-6 lg:max-w-6xl"
    >
      <Header resetView={resetView} />
      <TabsArea
        resetView={resetView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metric={metric}
        setMetric={setMetric}
        airInterventionFilter={airInterventionFilter}
        setAirInterventionFilter={setAirInterventionFilter}
        outcomeBreakdownScenarioId={outcomeBreakdownScenarioId}
        setOutcomeBreakdownScenarioId={setOutcomeBreakdownScenarioId}
        sortOrders={sortOrders}
        setChartSortOrder={setChartSortOrder}
      />
      <SiteFooter />
    </div>
  );
}

export default App;
