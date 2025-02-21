import "./App.css";
import { Header } from "@/components/header";
import { DALYs } from "@/components/DALYs";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { Bedbound } from "@/components/bedbound";
import { Cost } from "@/components/cost";
import { HeartAttacks } from "./components/heart-attacks";
import { LoweredIQ } from "./components/lowered-IQ";
import { Hospitalizations } from "./components/hospitalizations";
import { Housebound } from "./components/housebound";
import { LCCases } from "./components/LC-cases";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <WorkInProgressAlert />
            <Header />
            <div className="lg:max-w-7xl mx-auto w-full flex flex-col gap-8">
                <LCCases />
                <Cost />
                <Bedbound />
                <HeartAttacks />
                <Hospitalizations />
                <DALYs />
                <LoweredIQ />
                <Housebound />
                <SiteFooter />
            </div>
        </div>
    );
}

export default App;
