import "./App.css";
import { MainChart } from "./components/main-chart";
import { SiteFooter } from "./components/site-footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function App() {
    const date = new Date();
    const localDate = new Intl.DateTimeFormat(navigator.language).format(date);
    return (
        <div className="min-h-screen flex flex-col">
            <Alert className="bg-orange-100">
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    This is a work in progress and currently displaying test
                    data as of {localDate}
                </AlertDescription>
            </Alert>

            <header className="pb-4 md:pb-6 lg:pb-10 md:pt-2 lg:pt-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Long Covid DALYs
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
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
