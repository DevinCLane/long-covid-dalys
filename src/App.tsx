import "./App.css";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { LCCases } from "./components/LC-cases";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <WorkInProgressAlert />
      <Header />
      <div className="mx-auto flex w-full flex-col gap-8 lg:max-w-7xl">
        <LCCases />
        <SiteFooter />
      </div>
    </div>
  );
}

export default App;
