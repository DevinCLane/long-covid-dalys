import { useState } from "react";
import { AcuteCovidChart } from "./acute-covid-chart";
import { LongCovidChart } from "./long-covid-chart";
import { PascChart } from "./pasc-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getDefaultSelectedScenarios } from "@/config/scenarios";

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
    <Tabs defaultValue="lc" className="items-center">
      <TabsList>
        <TabsTrigger value="lc">Long COVID</TabsTrigger>
        <TabsTrigger value="pasc">PASC</TabsTrigger>
        <TabsTrigger value="acute">Acute COVID</TabsTrigger>
      </TabsList>
      <TabsContent value="lc">
        <LongCovidChart
          selectedScenarios={lcScenarios}
          setSelectedScenarios={setLcScenarios}
        />
      </TabsContent>
      <TabsContent value="pasc">
        <PascChart
          selectedScenarios={pascScenarios}
          setSelectedScenarios={setPascScenarios}
        />
      </TabsContent>
      <TabsContent value="acute">
        <AcuteCovidChart
          selectedScenarios={acuteScenarios}
          setSelectedScenarios={setAcuteScenarios}
        />
      </TabsContent>
    </Tabs>
  );
}
