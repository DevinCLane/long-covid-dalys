import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import { ProphylacticMedicationChart } from "@/components/charts/prophylactic-medication-chart";
import { LongCovidMedicationChart } from "@/components/charts/long-covid-medication-chart";
import { DalyModelProvider } from "@/components/daly-model-provider";
import { ScenarioId } from "@/config/scenario-daly-calculations";
import {
  type AirId,
  CHART_TAB_IDS,
  type ChartTabId,
  PARENT_ORIGIN,
  isAirInterventionFilter,
  isTabId,
  type TabId,
  isScenarioId,
  isMetric,
} from "@/config/iframe-messages";
import { ChartMetric } from "@/components/chart-metric-toggle";
import { ResetView } from "./reset-view";
import ShareButton from "./share-button";
import { isChartSortOrder, type ChartSortOrder } from "@/lib/chart-sort";

interface TabsAreaProps {
  resetView: () => void;
  activeTab: TabId;
  setActiveTab: (value: TabId) => void;
  metric: ChartMetric;
  setMetric: (value: ChartMetric) => void;
  airInterventionFilter: AirId;
  setAirInterventionFilter: (value: AirId) => void;
  outcomeBreakdownScenarioId: ScenarioId;
  setOutcomeBreakdownScenarioId: (value: ScenarioId) => void;
  sortOrders: Record<ChartTabId, ChartSortOrder>;
  setChartSortOrder: (tab: ChartTabId, value: ChartSortOrder) => void;
}

export default function TabsArea({
  resetView,
  activeTab,
  setActiveTab,
  metric,
  setMetric,
  airInterventionFilter,
  setAirInterventionFilter,
  outcomeBreakdownScenarioId,
  setOutcomeBreakdownScenarioId,
  sortOrders,
  setChartSortOrder,
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

  function selectChartSortOrder(tab: ChartTabId, sortOrder: ChartSortOrder) {
    setChartSortOrder(tab, sortOrder);
    window.parent.postMessage(
      { type: "dalys-sort-order-change", tab, sortOrder },
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

        if (isScenarioId(message.outcomeBreakdownScenarioId)) {
          setOutcomeBreakdownScenarioId(message.outcomeBreakdownScenarioId);
        }

        for (const tab of CHART_TAB_IDS) {
          if (isChartSortOrder(message.sortOrders?.[tab])) {
            setChartSortOrder(tab, message.sortOrders[tab]);
          }
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
    setChartSortOrder,
  ]);

  return (
    <DalyModelProvider>
      <Tabs
        className="items-center"
        value={activeTab}
        onValueChange={selectTab}
      >
        <div className="flex w-full flex-col sm:m-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="ml-auto hidden shrink-0 items-center gap-2 sm:order-2 sm:flex">
            <ResetView resetView={resetView} />
            <ShareButton />
          </div>
          <div className="w-full min-w-0 py-0.5 sm:w-auto sm:py-1.5">
            <TabsList
              variant="line"
              className="grid w-full grid-cols-2 p-0 group-data-[orientation=horizontal]/tabs:h-auto sm:flex sm:h-auto sm:w-fit sm:flex-wrap sm:gap-1 sm:p-[3px] sm:group-data-[orientation=horizontal]/tabs:h-auto"
            >
              <TabsTrigger
                value="air"
                className="h-full min-h-9 cursor-pointer py-0.5 leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:py-1 sm:whitespace-nowrap"
              >
                Air Cleaning
              </TabsTrigger>
              <TabsTrigger
                value="prophylaxis"
                className="h-full min-h-9 cursor-pointer py-0.5 leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:py-1 sm:whitespace-nowrap"
              >
                Prophylactic Medication
              </TabsTrigger>
              <TabsTrigger
                value="longCovidMedication"
                className="h-full min-h-9 cursor-pointer py-0.5 leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:py-1 sm:whitespace-nowrap"
              >
                Long COVID Medication
              </TabsTrigger>
              <TabsTrigger
                value="outcomeBreakdown"
                className="h-full min-h-9 cursor-pointer py-0.5 leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:py-1 sm:whitespace-nowrap"
              >
                Outcome breakdown
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="h-full min-h-9 cursor-pointer py-0.5 leading-snug whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:py-1 sm:whitespace-nowrap"
              >
                About
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="air" className="w-full">
          <AirCleaningChart
            sortOrder={sortOrders.air}
            setSortOrder={(value) => selectChartSortOrder("air", value)}
            onScenarioSelect={openOutcomeBreakdown}
            airInterventionFilter={airInterventionFilter}
            onAirInterventionFilterChange={selectAirInterventionFilter}
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="prophylaxis" className="w-full">
          <ProphylacticMedicationChart
            sortOrder={sortOrders.prophylaxis}
            setSortOrder={(value) => selectChartSortOrder("prophylaxis", value)}
            onScenarioSelect={openOutcomeBreakdown}
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="longCovidMedication" className="w-full">
          <LongCovidMedicationChart
            sortOrder={sortOrders.longCovidMedication}
            setSortOrder={(value) =>
              selectChartSortOrder("longCovidMedication", value)
            }
            onScenarioSelect={openOutcomeBreakdown}
            metric={metric}
            setMetric={selectMetric}
          />
        </TabsContent>
        <TabsContent value="outcomeBreakdown" className="w-full">
          <OutcomeBreakdownChart
            sortOrder={sortOrders.outcomeBreakdown}
            setSortOrder={(value) =>
              selectChartSortOrder("outcomeBreakdown", value)
            }
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
