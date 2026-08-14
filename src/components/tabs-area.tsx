import { useState } from "react";
import { AcuteCovidChart } from "@/components/charts/acute-covid-chart";
import { LongCovidChart } from "@/components/charts/long-covid-chart";
import { PascChart } from "@/components/charts/pasc-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getDefaultSelectedScenarios } from "@/config/scenarios";
import { BarChartStacked } from "@/components/charts/bar-chart";
import { DetailedBarChart } from "@/components/charts/detailed-bar-chart";

export default function TabsArea() {
  // selected scenarios for the year by year views
  const [lcScenarios, setLcScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );
  const [pascScenarios, setPascScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );
  const [acuteScenarios, setAcuteScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );
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
      <TabsList variant="line" className="mb-4 sm:mb-0">
        <div className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="lc">Long COVID</TabsTrigger>
          <TabsTrigger value="pasc">other sequelae</TabsTrigger>
          <TabsTrigger value="acute">acute COVID-19</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="overview" className="w-full">
        <BarChartStacked onScenarioSelect={openDetailedScenario} />
      </TabsContent>
      <TabsContent value="detailed" className="w-full">
        <DetailedBarChart
          scenarioId={detailedScenarioId}
          onScenarioSelect={selectDetailedScenario}
        />
      </TabsContent>
      <TabsContent value="lc" className="w-full">
        <LongCovidChart
          selectedScenarios={lcScenarios}
          setSelectedScenarios={setLcScenarios}
        />
      </TabsContent>
      <TabsContent value="pasc" className="w-full">
        <PascChart
          selectedScenarios={pascScenarios}
          setSelectedScenarios={setPascScenarios}
        />
      </TabsContent>
      <TabsContent value="acute" className="w-full">
        <AcuteCovidChart
          selectedScenarios={acuteScenarios}
          setSelectedScenarios={setAcuteScenarios}
        />
      </TabsContent>
    </Tabs>
  );
}
