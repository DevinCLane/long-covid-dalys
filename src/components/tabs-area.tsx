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
import { ResetView } from "./reset-view";
import ShareButton from "./share-button";

interface TabsAreaProps {
  resetView: () => void;
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
  resetView,
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
        <div className="flex w-full flex-col sm:m-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:order-2">
            <ResetView resetView={resetView} />
            <ShareButton />
          </div>
          <div className="w-full min-w-0 py-1.5 sm:w-auto">
            <TabsList
              variant="line"
              className="grid w-full grid-cols-2 group-data-[orientation=horizontal]/tabs:h-auto sm:inline-flex sm:w-fit sm:gap-1 sm:group-data-[orientation=horizontal]/tabs:h-9"
            >
              <TabsTrigger
                value="air"
                className="h-full min-h-11 cursor-pointer leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:whitespace-nowrap"
              >
                Air Cleaning
              </TabsTrigger>
              <TabsTrigger
                value="pharmaceuticals"
                className="h-full min-h-11 cursor-pointer leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:whitespace-nowrap"
              >
                Pharmaceuticals
              </TabsTrigger>
              <TabsTrigger
                value="outcomeBreakdown"
                className="h-full min-h-11 cursor-pointer leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:whitespace-nowrap"
              >
                Outcome breakdown
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="h-full min-h-11 cursor-pointer leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:whitespace-nowrap"
              >
                About
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
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
