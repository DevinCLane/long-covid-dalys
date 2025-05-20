import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { LCDALYs } from "@/components/LC-DALYs";
import { NavBar } from "./components/nav-bar";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="mx-auto flex min-h-screen flex-col lg:max-w-7xl">
        <NavBar />
        <WorkInProgressAlert />
        <Header />
        <div className="mx-auto flex w-full flex-col gap-8">
          <LCDALYs />
          <SiteFooter />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
