import { AcuteCovidChart } from "./acute-covid-chart";
import { LongCovidChart } from "./long-covid-chart";
import { PascChart } from "./pasc-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function TabsArea() {
  return (
    <Tabs defaultValue="lc" className="items-center">
      <TabsList>
        <TabsTrigger value="lc">Long COVID</TabsTrigger>
        <TabsTrigger value="pasc">PASC</TabsTrigger>
        <TabsTrigger value="acute">Acute COVID</TabsTrigger>
      </TabsList>
      <TabsContent value="lc">
        <LongCovidChart />
      </TabsContent>
      <TabsContent value="pasc">
        <PascChart />
      </TabsContent>
      <TabsContent value="acute">
        <AcuteCovidChart />
      </TabsContent>
    </Tabs>
  );
}
