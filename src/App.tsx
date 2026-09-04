// import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { NavBar } from "./components/nav-bar";
import TabsArea from "./components/tabs-area";

function App() {
  return (
    <div className="mx-auto flex min-h-screen flex-col px-4 py-2 text-center md:px-8 md:py-6 lg:max-w-6xl">
      <NavBar />
      <Header />
      <TabsArea />
      <SiteFooter />
    </div>
  );
}

export default App;
