"use client";

import { OutcomeBreakdownChart } from "@/components/charts/outcome-breakdown-chart";

export function LandingPageChart() {
  return (
    <OutcomeBreakdownChart
      variant="landing"
      description={
        <div className="text-foreground/85 max-w-[100ch] space-y-4 text-left text-base leading-relaxed">
          <p>
            <span className="text-foreground font-medium">
              Welcome to the COVID-19 DALYs simulator.
            </span>{" "}
            COVID-19 infections continue to cause meaningful increases in
            sickness and disability in the United States and worldwide. One
            measure used to quantify the disability caused by COVID-19 and other
            diseases is the disability-adjusted life year (DALY), a composite
            measure of health and life lost to a given health condition.
          </p>
          <p>
            On this first page, users can view estimates of DALYs caused by
            acute COVID-19 infections, Long COVID, and other post-acute sequelae
            of COVID-19 infection. On the following pages, users can view
            interventions to reduce COVID-19-associated disability, including
            air cleaning, preventative medications, and potential treatments for
            Long COVID. Below each page under “Model Assumptions”, interactive
            options allow users to modify the assumptions used to model these
            interventions’ effects.
          </p>
        </div>
      }
    />
  );
}
