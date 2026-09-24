// import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { NavBar } from "./components/nav-bar";
import TabsArea from "./components/tabs-area";
import { useEffect, useRef, useState } from "react";
import {
  AirId,
  PARENT_ORIGIN,
  PharmaceuticalId,
  TabId,
} from "./config/iframe-messages";
import { ChartMetric } from "./components/chart-metric-toggle";
import { ScenarioId } from "./config/scenario-daly-calculations";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("air");
  const [metric, setMetric] = useState<ChartMetric>("percent");
  const [airInterventionFilter, setAirInterventionFilter] =
    useState<AirId>("all");
  const [
    pharmaceuticalInterventionFilter,
    setPharmaceuticalInterventionFilter,
  ] = useState<PharmaceuticalId>("all");
  const [outcomeBreakdownScenarioId, setOutcomeBreakdownScenarioId] =
    useState<ScenarioId>("hepa_all_public");
  const outerDiv = useRef<HTMLDivElement>(null);

  function resetView() {
    setActiveTab("air");
    setMetric("percent");
    setAirInterventionFilter("all");
    setPharmaceuticalInterventionFilter("all");
    setOutcomeBreakdownScenarioId("hepa_all_public");
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
      <NavBar resetView={resetView} />
      <Header />
      <TabsArea
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metric={metric}
        setMetric={setMetric}
        airInterventionFilter={airInterventionFilter}
        setAirInterventionFilter={setAirInterventionFilter}
        pharmaceuticalInterventionFilter={pharmaceuticalInterventionFilter}
        setPharmaceuticalInterventionFilter={
          setPharmaceuticalInterventionFilter
        }
        outcomeBreakdownScenarioId={outcomeBreakdownScenarioId}
        setOutcomeBreakdownScenarioId={setOutcomeBreakdownScenarioId}
      />
      <SiteFooter />
    </div>
  );
}

export default App;
