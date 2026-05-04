import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { LongCovidChart } from "@/components/long-covid-chart";
import { NavBar } from "./components/nav-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="mx-auto flex min-h-screen flex-col px-4 py-8 text-center md:px-8 lg:max-w-6xl">
        <NavBar />
        <WorkInProgressAlert />
        <Header />
        <Tabs defaultValue="lc">
          <TabsList>
            <TabsTrigger value="lc">Long COVID</TabsTrigger>
            <TabsTrigger value="pasc">PASC</TabsTrigger>
            <TabsTrigger value="acute">Acute COVID</TabsTrigger>
          </TabsList>
          <TabsContent value="lc">
            <LongCovidChart />
          </TabsContent>
          <TabsContent value="pasc">PASC</TabsContent>
          <TabsContent value="acute">Acute COVID</TabsContent>
        </Tabs>

        <SiteFooter />
      </div>
    </ThemeProvider>
  );
}

export default App;
