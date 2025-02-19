import "./App.css";
import { Header } from "@/components/header";
import { DALYs } from "@/components/DALYs";
import { SiteFooter } from "@/components/site-footer";
import { WorkInProgressAlert } from "@/components/work-in-progress-alert";
import { Bedbound } from "@/components/bedbound";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <WorkInProgressAlert />
            <Header />
            <div className="lg:max-w-7xl mx-auto w-full">
                <DALYs />
                <Bedbound />
                <SiteFooter />
            </div>
        </div>
    );
}

export default App;
