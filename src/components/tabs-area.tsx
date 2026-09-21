import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import {
  PharmaceuticalChart,
  type PharmaceuticalInterventionFilter,
} from "@/components/charts/pharmaceutical-chart";
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
} from "@/config/iframe-messages";

export default function TabsArea() {
  const [activeTab, setActiveTab] = useState<TabId>("air");
  const [detailedScenarioId, setDetailedScenarioId] =
    useState<ScenarioId>("hepa_all_public");
  const [airInterventionFilter, setAirInterventionFilter] =
    useState<AirId>("all");
  const [
    pharmaceuticalInterventionFilter,
    setPharmaceuticalInterventionFilter,
  ] = useState<PharmaceuticalInterventionFilter>("all");

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

  function selectDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
    window.parent.postMessage(
      {
        type: "dalys-outcome-breakdown-filter",
        outcomeBreakdownFilter: scenarioId,
      },
      PARENT_ORIGIN,
    );
  }

  function openDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
    selectTab("detailed");
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
        if (isScenarioId(message.outcomeBreakdownFilter)) {
          setDetailedScenarioId(message.outcomeBreakdownFilter);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    // Announce readiness only after the response listener is attached.
    window.parent.postMessage({ type: "dalys-ready" }, PARENT_ORIGIN);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <DalyModelProvider>
      <Tabs
        className="items-center"
        value={activeTab}
        onValueChange={selectTab}
      >
        <TabsList variant="line" className="mt-2 mb-6 sm:m-0">
          <div>
            {/*<TabsTrigger value="overview" className="cursor-pointer">
              Overview
            </TabsTrigger>*/}
            <TabsTrigger value="air" className="cursor-pointer">
              Air Cleaning
            </TabsTrigger>
            <TabsTrigger value="pharmaceuticals" className="cursor-pointer">
              Pharmaceuticals
            </TabsTrigger>
            <TabsTrigger value="detailed" className="cursor-pointer">
              Outcome breakdown
            </TabsTrigger>
            {/*
          <TabsTrigger value="publicHealth" className="cursor-pointer">Public Health</TabsTrigger> */}
            <TabsTrigger value="about" className="cursor-pointer">
              About
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="air" className="w-full">
          <AirCleaningChart
            onScenarioSelect={openDetailedScenario}
            airInterventionFilter={airInterventionFilter}
            onAirInterventionFilterChange={selectAirInterventionFilter}
          />
        </TabsContent>
        <TabsContent value="pharmaceuticals" className="w-full">
          <PharmaceuticalChart
            onScenarioSelect={openDetailedScenario}
            pharmaceuticalInterventionFilter={pharmaceuticalInterventionFilter}
            onPharmaceuticalInterventionFilterChange={
              selectPharmaceuticalInterventionFilter
            }
          />
        </TabsContent>
        <TabsContent value="detailed" className="w-full">
          <OutcomeBreakdownChart
            scenarioId={detailedScenarioId}
            onScenarioSelect={selectDetailedScenario}
          />
        </TabsContent>
        {/*<TabsContent value="publicHealth" className="w-full">
          <div>Coming soon</div>
        </TabsContent>*/}
        <TabsContent value="about" className="w-full">
          <AboutPage />
        </TabsContent>
      </Tabs>
    </DalyModelProvider>
  );
}
