import { SIMULATOR_CITATION } from "@/config/citation";

export function SiteFooter() {
  return (
    <footer className="text-muted-foreground mt-8 border-t px-1 py-6 text-left text-sm leading-relaxed sm:px-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground mb-2 font-medium">Cite this source</h2>
          <p>{SIMULATOR_CITATION}</p>
        </div>
        <p className="text-xs">
          Website by{" "}
          <a
            href="https://www.devinlane.com/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Devin Lane
          </a>
          . Source code available on{" "}
          <a
            href="https://github.com/DevinCLane/long-covid-dalys"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
