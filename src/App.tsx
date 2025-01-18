import "./App.css";
import { MainChart } from "./components/main-chart";
import { SiteFooter } from "./components/site-footer";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="pb-4 md:pb-6 lg:pb-10 md:pt-2 lg:pt-4">
                <h1 className="p-4">Long Covid DALYs</h1>
                <p>
                    How public health interventions could decrease or increase
                    cases of long covid
                </p>
            </header>
            <div className="lg:max-w-7xl mx-auto w-full">
                <MainChart />
                <SiteFooter />
            </div>
        </div>
    );
}

export default App;
