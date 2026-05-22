import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { NavBar } from "./components/nav-bar";
import TabsArea from "./components/tabs-area";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="mx-auto flex min-h-screen flex-col px-4 py-8 text-center md:px-8 lg:max-w-6xl">
        <NavBar />
        <WorkInProgressAlert />
        <Header />
        <TabsArea />
        <SiteFooter />
      </div>
    </ThemeProvider>
  );
}

export default App;
