"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <Card>
      {/* chart header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <div className="align-center mb-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
            <CardTitle className="text-lg text-pretty md:text-2xl">
              About the model
            </CardTitle>
          </div>
          <CardDescription>
            Describing the model's assumptions and data sources.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-left leading-7 md:px-8">
          <p>
            For the status quo scenario, baseline rates of annual COVID
            infection in the general population were identified from Ferrari et
            al., 2024. The effect of each intervention (or of multiple
            interventions) on the baseline infection rate was estimated from
            parameters derived from published research.
          </p>
          <p>
            Disability-Adjusted Life Years (DALYs) are defined as the sum of
            Years of Life Lost to disease (YLLs) and Years of Life Lived with
            Disease (YLDs). We calculated DALYs by incorporating the
            scenario-specific infection proportions estimated above into a
            previously published Markov state-transition model with five
            one-year cycles.{" "}
          </p>
          <p>
            We modeled the rates of transitions between five health states: no
            Long COVID, less severe Long COVID, more severe Long COVID, death
            from unrelated causes, and Long COVID-attributable death. Deaths
            were recorded in the cycle in which they occurred, with only Long
            COVID-attributable deaths contributing to YLLs.
          </p>
          <p>
            To ensure our model simulates the effects of interventions at
            population scale, we use a stable-population approximation rather
            than modeling depletion of a fixed cohort over time. At the start of
            each new cycle, individuals who exited the model through death were
            replaced by individuals in the no-Long COVID state. These new
            individuals were subject to the same modeled transitions as the rest
            of the population, including the possibility of developing Long
            COVID.
          </p>
          <p>
            Model parameters were identified from published peer-reviewed
            research. Because age-specific estimates of Long COVID risk are
            unavailable, we apply population-level estimates for these risks
            across the model. We assume that rates of transition between states
            remain stable over time. To account for age-related differences in
            mortality without modeling separate age groups, we calculated
            background mortality and remaining life expectancy as averages
            weighted by the US population distribution among adults aged 18
            years and older. DALY calculations include discounting at 0.1
            percent annually.{" "}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
