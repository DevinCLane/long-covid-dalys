import { LucideDownload } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="p-6">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-left text-sm leading-loose text-muted-foreground">
            <h4 className="mb-2 text-lg font-semibold">Cite this source</h4>
            <p>
              Cohen AK, Jaudon TW, Cho O, Lane DC, Vogel JM. Benefits of air
              cleaning interventions on COVID-19 infection and Long
              COVID-related disability-adjusted life years: A policy simulation.
            </p>
            {/* todo: add .RIS download when available */}
            {/* <a className="flex cursor-pointer justify-center gap-2 hover:underline">
              Download Citation <LucideDownload />
            </a> */}
            <hr className="mb-2 mt-2" />
            <p>
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
        </div>
      </div>
    </footer>
  );
}
