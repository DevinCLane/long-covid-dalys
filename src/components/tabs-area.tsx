import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import { PharmaceuticalChart } from "@/components/charts/pharmaceutical-chart";
import { DalyModelProvider } from "@/components/daly-model-provider";
import { ScenarioId } from "@/config/scenario-daly-calculations";
import {
  type AirId,
  PARENT_ORIGIN,
  isAirInterventionFilter,
  isTabId,
  type TabId,
  isPharmaceuticalInterventionFilter,
  isScenarioId,
  PharmaceuticalId,
  isMetric,
} from "@/config/iframe-messages";
import { ChartMetric } from "@/components/chart-metric-toggle";

interface TabsAreaProps {
  activeTab: TabId;
  setActiveTab: (value: TabId) => void;
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
  airInterventionFilter: AirId;
  setAirInterventionFilter: (value: AirId) => void;
  pharmaceuticalInterventionFilter: PharmaceuticalId;
  setPharmaceuticalInterventionFilter: (value: PharmaceuticalId) => void;
  outcomeBreakdownScenarioId: ScenarioId;
  setOutcomeBreakdownScenarioId: (value: ScenarioId) => void;
}

export default function TabsArea({
  activeTab,
  setActiveTab,
  metric,
  setMetric,
  airInterventionFilter,
  setAirInterventionFilter,
  pharmaceuticalInterventionFilter,
  setPharmaceuticalInterventionFilter,
  outcomeBreakdownScenarioId,
  setOutcomeBreakdownScenarioId,
}: TabsAreaProps) {
  /**
   * User navigation creates history; messages from the parent only restore it.
   */
  function selectTab(nextTab: string) {
    if (!isTabId(nextTab)) return;
    setActiveTab(nextTab);
    window.parent.postMessage(
      { type: "dalys-tab-change", tab: nextTab },
      PARENT_ORIGIN,
    );
  }

  function selectMetric(nextMetric: ChartMetric) {
    setMetric(nextMetric);
    window.parent.postMessage(
      { type: "dalys-metric-change", metric: nextMetric },
      PARENT_ORIGIN,
    );
  }

  /**
   * select the air intervention filter, send postMessage to parent of iframe in order to update URL
   */
  function selectAirInterventionFilter(nextAirInterventionFilter: string) {
    if (!isAirInterventionFilter(nextAirInterventionFilter)) return;
    setAirInterventionFilter(nextAirInterventionFilter);
    window.parent.postMessage(
      {
        type: "dalys-air-intervention-filter-change",
        airInterventionFilter: nextAirInterventionFilter,
      },
      PARENT_ORIGIN,
    );
  }

  /**
   * select pharmaceutical intervention filter, send postMessage to parent of iframe to update URL
   */
  function selectPharmaceuticalInterventionFilter(
    nextPharmaceuticalInterventionFilter: string,
  ) {
    if (
      !isPharmaceuticalInterventionFilter(nextPharmaceuticalInterventionFilter)
    )
      return;
    setPharmaceuticalInterventionFilter(nextPharmaceuticalInterventionFilter);
    window.parent.postMessage(
      {
        type: "dalys-pharmaceutical-intervention-filter-change",
        pharmaceuticalInterventionFilter: nextPharmaceuticalInterventionFilter,
      },
      PARENT_ORIGIN,
    );
  }

  function selectOutcomeBreakdownScenario(scenarioId: ScenarioId) {
    if (!isScenarioId(scenarioId)) return;
    setOutcomeBreakdownScenarioId(scenarioId);
    window.parent.postMessage(
      {
        type: "dalys-outcome-breakdown-scenario-change",
        outcomeBreakdownScenarioId: scenarioId,
      },
      PARENT_ORIGIN,
    );
  }

  function openOutcomeBreakdown(scenarioId: ScenarioId) {
    if (!isScenarioId(scenarioId)) return;
    selectTab("outcomeBreakdown");
    selectOutcomeBreakdownScenario(scenarioId);
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== PARENT_ORIGIN || event.source !== window.parent) {
        return;
      }
      const message = event.data;
      if (message?.type === "dalys-state") {
        if (isTabId(message.tab)) {
          setActiveTab(message.tab);
        }

        if (isMetric(message.metric)) {
          setMetric(message.metric);
        }

        if (isAirInterventionFilter(message.airInterventionFilter)) {
          setAirInterventionFilter(message.airInterventionFilter);
        }

        if (
          isPharmaceuticalInterventionFilter(
            message.pharmaceuticalInterventionFilter,
          )
        ) {
          setPharmaceuticalInterventionFilter(
            message.pharmaceuticalInterventionFilter,
          );
        }

        if (isScenarioId(message.outcomeBreakdownScenarioId)) {
          setOutcomeBreakdownScenarioId(message.outcomeBreakdownScenarioId);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    // Announce readiness only after the response listener is attached.
    window.parent.postMessage({ type: "dalys-ready" }, PARENT_ORIGIN);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    setActiveTab,
    setAirInterventionFilter,
    setMetric,
    setOutcomeBreakdownScenarioId,
    setPharmaceuticalInterventionFilter,
  ]);

  return (
    <DalyModelProvider>
      <Tabs
        className="items-center"
        value={activeTab}
        onValueChange={selectTab}
      >
        <TabsList variant="line" className="mt-2 mb-6 sm:m-0">
          <div>
            <TabsTrigger value="air" className="cursor-pointer">
              Air Cleaning
            </TabsTrigger>
            <TabsTrigger value="pharmaceuticals" className="cursor-pointer">
              Pharmaceuticals
            </TabsTrigger>
            <TabsTrigger value="outcomeBreakdown" className="cursor-pointer">
              Outcome breakdown
            </TabsTrigger>
            <TabsTrigger value="about" className="cursor-pointer">
              About
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="air" className="w-full">
          <AirCleaningChart
            onScenarioSelect={openOutcomeBreakdown}
            airInterventionFilter={airInterventionFilter}
            onAirInterventionFilterChange={selectAirInterventionFilter}
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="pharmaceuticals" className="w-full">
          <PharmaceuticalChart
            onScenarioSelect={openOutcomeBreakdown}
            pharmaceuticalInterventionFilter={pharmaceuticalInterventionFilter}
            onPharmaceuticalInterventionFilterChange={
              selectPharmaceuticalInterventionFilter
            }
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="outcomeBreakdown" className="w-full">
          <OutcomeBreakdownChart
            scenarioId={outcomeBreakdownScenarioId}
            onScenarioSelect={selectOutcomeBreakdownScenario}
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="about" className="w-full">
          <AboutPage />
        </TabsContent>
      </Tabs>
    </DalyModelProvider>
  );
}
