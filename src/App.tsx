import "./App.css";
import { Header } from "./components/header";
import { MainChart } from "./components/main-chart";
import { SiteFooter } from "./components/site-footer";
import { WorkInProgressAlert } from "./components/work-in-progress-alert";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <WorkInProgressAlert />
            <Header />
            <div className="lg:max-w-7xl mx-auto w-full">
                <MainChart />
                <SiteFooter />
            </div>
        </div>
    );
}

export default App;
