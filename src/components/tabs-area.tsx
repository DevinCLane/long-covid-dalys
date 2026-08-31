import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OverviewChart } from "@/components/charts/overview-chart";
import { DetailedBarChart } from "@/components/charts/detailed-bar-chart";
import { AirCleaningChart } from "@/components/charts/air-cleaning-chart";
import { AboutPage } from "@/components/about";
import { PharmaceuticalChart } from "@/components/charts/pharmaceutical-chart";
import { runAcuteCovid, runLongCovid, runPasc } from "@/config/daly-model";

export default function TabsArea() {
  // active tabs for the detailed views
  const [activeTab, setActiveTab] = useState("overview");
  const [detailedScenarioId, setDetailedScenarioId] = useState("baseline");
  // const [implmentationPercentage, setImplementationPercentage] = useState(100);

  function updateSliderValue(updatedNumber: number) {
    const percentToDecimal = updatedNumber * 0.01;
    // setImplementationPercentage(updatedPercentage);
    const acuteCovid = runAcuteCovid({
      userOptions: { annualInfectionProportion: percentToDecimal },
    });
    const longCovid = runLongCovid
    const newTotals = acuteCovid.totals.dalysPer1000;
  }

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
        <div>
          <TabsTrigger value="overview" className="cursor-pointer">
            Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="cursor-pointer">
            Detailed
          </TabsTrigger>
          {/* <TabsTrigger value="air" className="cursor-pointer">Air Cleaning</TabsTrigger>
          <TabsTrigger value="pharmaceuticals" className="cursor-pointer">Pharmaceuticals</TabsTrigger>
          <TabsTrigger value="publicHealth" className="cursor-pointer">Public Health</TabsTrigger> */}
          <TabsTrigger value="about" className="cursor-pointer">
            About
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="overview" className="w-full">
        <OverviewChart
          onScenarioSelect={openDetailedScenario}
          onUpdateSlider={updateSliderValue}
        />
      </TabsContent>
      <TabsContent value="detailed" className="w-full">
        <DetailedBarChart
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
  );
}
