import "./App.css";
import { MainChart } from "./components/main-chart";
import { SiteFooter } from "./components/site-footer";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <h1 className="pb-4 md:pb-6 lg:pb-10 md:pt-2 lg:pt-4">
                Long Covid DALYs
            </h1>
            <div>
                <MainChart />
            </div>
            <SiteFooter />
        </div>
    );
}

export default App;
