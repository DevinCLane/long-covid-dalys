import { useState } from "react";
import { AcuteCovidChart } from "@/components/charts/acute-covid-chart";
import { LongCovidChart } from "@/components/charts/long-covid-chart";
import { PascChart } from "@/components/charts/pasc-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getDefaultSelectedScenarios } from "@/config/scenarios";
import { BarChartStacked } from "@/components/charts/bar-chart";

export default function TabsArea() {
  const [lcScenarios, setLcScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );
  const [pascScenarios, setPascScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );
  const [acuteScenarios, setAcuteScenarios] = useState<Set<string>>(
    getDefaultSelectedScenarios,
  );

  return (
    <Tabs defaultValue="overview" className="items-center">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="lc">Long COVID</TabsTrigger>
        <TabsTrigger value="pasc">PASC</TabsTrigger>
        <TabsTrigger value="acute">Acute COVID</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="w-full">
        <BarChartStacked />
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
