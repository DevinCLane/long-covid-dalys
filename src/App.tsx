import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { MainChart } from "@/components/main-chart";
import { NavBar } from "./components/nav-bar";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="mx-auto flex min-h-screen flex-col px-4 py-8 text-center md:px-8 lg:max-w-6xl">
        <NavBar />
        <WorkInProgressAlert />
        <Header />
        <MainChart />
        <SiteFooter />
      </div>
    </ThemeProvider>
  );
}

export default App;
