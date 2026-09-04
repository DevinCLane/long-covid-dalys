import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import { PharmaceuticalChart } from "@/components/charts/pharmaceutical-chart";
import { DalyModelProvider } from "@/components/daly-model-provider";
import { ScenarioId } from "@/config/scenario-daly-calculations";

export default function TabsArea() {
  const [activeTab, setActiveTab] = useState("air");
  const [detailedScenarioId, setDetailedScenarioId] =
    useState<ScenarioId>("hepa_all_public");

  function selectDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
  }

  function openDetailedScenario(scenarioId: ScenarioId) {
    setDetailedScenarioId(scenarioId);
    setActiveTab("detailed");
  }

  return (
    <DalyModelProvider>
      <Tabs
        defaultValue="air"
        className="items-center"
        value={activeTab}
        onValueChange={setActiveTab}
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
        <TabsContent value="detailed" className="w-full">
          <OutcomeBreakdownChart
            scenarioId={detailedScenarioId}
            onScenarioSelect={selectDetailedScenario}
          />
        </TabsContent>
        <TabsContent value="air" className="w-full">
          <AirCleaningChart onScenarioSelect={openDetailedScenario} />
        </TabsContent>
        <TabsContent value="pharmaceuticals" className="w-full">
          <PharmaceuticalChart onScenarioSelect={openDetailedScenario} />
        </TabsContent>
        <TabsContent value="publicHealth" className="w-full">
          <div>Coming soon</div>
        </TabsContent>
        <TabsContent value="about" className="w-full">
          <AboutPage />
        </TabsContent>
      </Tabs>
    </DalyModelProvider>
  );
}
