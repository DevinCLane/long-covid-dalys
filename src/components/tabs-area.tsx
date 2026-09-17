import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import { PharmaceuticalChart } from "@/components/charts/pharmaceutical-chart";
import { DalyModelProvider } from "@/components/daly-model-provider";
import { ScenarioId } from "@/config/scenario-daly-calculations";

export default function TabsArea() {
  const targetOrigin = "https://polybio.org";
  const [activeTab, setActiveTab] = useState("air");
  const [detailedScenarioId, setDetailedScenarioId] =
    useState<ScenarioId>("hepa_all_public");

  /**
   * updates visible tab, and sends new selction to iframe parent
   */
  function userSelection(nextTab: string) {
    setActiveTab(nextTab);
    window.parent.postMessage({ queryParam: nextTab }, targetOrigin);
  }

  function selectDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
  }

  function openDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
    setActiveTab("detailed");
  }

  /**
   * listens for history events from the iframe's parent
   */
  window.addEventListener("message", (event) => {
    const parentOrigin = "https://polybio.org";
    const url = new URL(window.location.href);
    if (event.origin !== parentOrigin) {
      console.error("event origin doesn't match iframe parent origin");
      return;
    }

    const messageData = event.data;
    if (!messageData.queryParam) {
      console.error("no query param found");
      return;
    }
    setActiveTab(messageData.queryParam);
  });

  return (
    <DalyModelProvider>
      <Tabs
        defaultValue="air"
        className="items-center"
        value={activeTab}
        onValueChange={userSelection}
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
          <AirCleaningChart onScenarioSelect={openDetailedScenario} />
        </TabsContent>
        <TabsContent value="pharmaceuticals" className="w-full">
          <PharmaceuticalChart onScenarioSelect={openDetailedScenario} />
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
