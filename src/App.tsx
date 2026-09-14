// import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { NavBar } from "./components/nav-bar";
import TabsArea from "./components/tabs-area";
import { useEffect, useRef } from "react";

function App() {
  const outerDiv = useRef<HTMLDivElement>(null);
  const targetOrigin = "https://polybio.org";

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const clientHeight = entry.target.clientHeight;
        if (clientHeight) {
          console.log(clientHeight);
          window.parent.postMessage({ height: clientHeight }, targetOrigin);
        }
      }
    });

    if (!outerDiv.current) {
      return;
    }
    resizeObserver.observe(outerDiv.current);

    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div
      ref={outerDiv}
      className="mx-auto flex flex-col px-4 py-2 text-center md:px-8 md:py-6 lg:max-w-6xl"
    >
      <NavBar />
      <Header />
      <TabsArea />
      <SiteFooter />
    </div>
  );
}

export default App;
