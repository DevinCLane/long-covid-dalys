import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OverviewChart } from "@/components/charts/overview-chart";
import { DetailedBarChart } from "@/components/charts/detailed-bar-chart";

export default function TabsArea() {
  // active tabs for the detailed views
  const [activeTab, setActiveTab] = useState("overview");
  const [detailedScenarioId, setDetailedScenarioId] = useState("baseline");

  function selectDetailedScenario(scenarioId: string) {
    setDetailedScenarioId(scenarioId);
  }

  function openDetailedScenario(scenarioId: string) {
    setDetailedScenarioId(scenarioId);
    setActiveTab("detailed");
  }

  return (
    <Tabs
      defaultValue="overview"
      className="items-center"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList variant="line" className="mt-2 mb-6 sm:m-0">
        <div className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="air">Air Cleaning</TabsTrigger>
          <TabsTrigger value="pharmaceuticals">Pharmaceuticals</TabsTrigger>
          <TabsTrigger value="publicHealth">Public Health</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="overview" className="w-full">
        <OverviewChart onScenarioSelect={openDetailedScenario} />
      </TabsContent>
      <TabsContent value="detailed" className="w-full">
        <DetailedBarChart
          scenarioId={detailedScenarioId}
          onScenarioSelect={selectDetailedScenario}
        />
      </TabsContent>
      <TabsContent value="air" className="w-full">
        <OverviewChart onScenarioSelect={openDetailedScenario} />
      </TabsContent>
      <TabsContent value="pharmaceuticals" className="w-full">
        <div>Coming soon</div>
      </TabsContent>
      <TabsContent value="publicHealth" className="w-full">
        <div>Coming soon</div>
      </TabsContent>
    </Tabs>
  );
}
