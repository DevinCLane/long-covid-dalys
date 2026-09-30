"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <Card className="gap-0 overflow-hidden text-left">
      <CardHeader className="border-b px-5 sm:px-8">
        <div className="mx-auto w-full max-w-3xl space-y-3">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            About the model
          </h2>
          <CardDescription className="text-base leading-7">
            Definition of terms, describing the model's assumptions and data
            sources.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-8 sm:px-8 sm:pt-10">
        <article
          aria-label="Model assumptions and interventions"
          className="[&_a]:decoration-muted-foreground/50 [&_a:hover]:decoration-foreground mx-auto max-w-3xl space-y-10 text-base leading-7 text-pretty [&_a]:rounded-sm [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4"
        >
          <section
            aria-labelledby="model-assumptions-heading"
            className="scroll-mt-6 space-y-7"
          >
            <h3 className="border-b pb-3 text-2xl font-bold tracking-tight">
              Model assumptions
            </h3>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Baseline infection rates
              </h4>
              <p>
                Baseline rates of annual COVID infection in the general
                population were identified from a recent national study of COVID
                prevalence using wastewater surveillance data (
                <a href="https://doi.org/10.1016/j.puhe.2025.105970">
                  Austria, 2024-2025
                </a>
                ). The effect of each intervention (or of multiple
                interventions) on the baseline infection rate was estimated from
                parameters derived from published research.
              </p>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Calculating disability-adjusted life years (DALYs)
              </h4>
              <p>
                Disability-Adjusted Life Years (DALYs) are defined as the sum of
                Years of Life Lost to disease (YLLs) and Years of Life Lived
                with Disease (YLDs). We calculated DALYs by incorporating the
                scenario-specific infection proportions estimated above into a{" "}
                <a href="https://chds.hsph.harvard.edu/joint-modeling-of-dalys-and-qalys/">
                  previously published Markov state-transition model
                </a>{" "}
                with five one-year cycles. We assume that rates of transition
                between states remain stable over time. DALY calculations
                include discounting at 0.1 percent annually.
              </p>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Long COVID-related DALYs
              </h4>
              <p>
                We model Long COVID at two severities with related disability
                weights, one representing patients with ongoing symptoms and
                some activity limitations (“less severe”), and one representing
                patients with ongoing symptoms and significant activity
                limitations (“more severe”), drawing from CDC{" "}
                <a href="https://www.cdc.gov/nchs/covid19/pulse/long-covid.htm">
                  Household Pulse Survey
                </a>{" "}
                data. We modeled the rates of transitions between five health
                states: no Long COVID, less severe Long COVID, more severe Long
                COVID, death from unrelated causes, and Long COVID-attributable
                death. Deaths were recorded in the cycle in which they occurred,
                with only Long COVID-attributable deaths contributing to YLLs.
              </p>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Acute COVID-related DALYs
              </h4>
              <p>
                We model acute COVID infections as a source of short-term
                disability and mortality. Current estimates of mortality rates
                from acute COVID infections are drawn from the{" "}
                <a href="https://doi.org/10.1038/s41467-024-47199-3">
                  most recent national estimates
                </a>{" "}
                available and are adjusted relative to the US age distribution.
                Disability weight is drawn from the Global Burden of Disease
                project’s 2024 disability weights. Acute COVID DALYs were
                calculated directly from annual infection proportions,
                duration-weighted disability, the risk of death following
                SARS-CoV-2 infection in each age group, and the corresponding
                remaining life expectancy. Separate transitions between
                infection, recovery, and death were not modeled.
              </p>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Post-acute sequelae of COVID (PASC)
              </h4>
              <p>
                Although some consensus definitions of Long COVID (e.g.,{" "}
                <a href="https://doi.org/10.17226/27768">NASEM</a>) include
                persons with new-onset or worsened comorbid conditions following
                a COVID infection in the category of Long COVID patients, we
                model these patients separately to apply the distinct disability
                weights already assigned to these conditions. We model the
                following new-onset conditions as post-acute sequelae of COVID,
                incorporating both increased disability and age-adjusted
                mortality: acute myocardial infarction; heart failure; dementia;
                stroke; pulmonary embolism; and type 1 and type 2 diabetes.
                Disability weights are drawn from the Global Burden of Disease
                project’s 2024 disability weights.
              </p>
              <p>
                Each PASC condition was modeled separately, without dividing the
                condition into less severe and more severe states. Individuals
                could develop the condition, remain affected, or die from the
                condition or other causes. In addition, for myocardial
                infarction, pulmonary embolism, and stroke, the model includes
                the possibility of recovery from these conditions. Diabetes,
                dementia, and heart failure were modeled as persistent
                conditions over a 5-year horizon. For heart failure and
                dementia, separate mortality estimates were applied during the
                first year after onset and subsequent years, based on published
                survival data.
              </p>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-semibold tracking-tight">
                Population and age assumptions
              </h4>
              <p>
                To ensure our model simulates the effects of interventions at
                population scale, we use a stable-population approximation
                rather than modeling depletion of a fixed cohort over time. At
                the start of each new cycle, individuals who exited the model
                through death were replaced by individuals in the no-Long COVID
                state. These new individuals were subject to the same modeled
                transitions as the rest of the population, including the
                possibility of developing Long COVID.
              </p>
              <p>
                To account for age-related differences in mortality without
                modeling separate age groups, we calculated background mortality
                and remaining life expectancy as averages weighted by the{" "}
                <a href="https://data.census.gov/table?q=DP05">
                  US population distribution
                </a>{" "}
                among adults aged 18 years and older. Because age-specific
                estimates of Long COVID risk are unavailable, we apply
                population-level estimates for these risks across the model.
              </p>
            </section>
          </section>
          <section
            aria-labelledby="interventions-heading"
            className="space-y-8 border-t pt-8"
          >
            <h3
              id="interventions-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Interventions
            </h3>
            <section
              id="air-cleaning-interventions"
              aria-labelledby="air-cleaning-heading"
              className="scroll-mt-6 space-y-6"
            >
              <h4
                id="air-cleaning-heading"
                className="text-xl font-bold tracking-tight"
              >
                Air cleaning interventions
              </h4>
              <section className="space-y-5">
                <h5 className="text-sm font-bold tracking-wide italic">
                  Intervention types
                </h5>
                <dl className="space-y-6">
                  <div className="space-y-2">
                    <dt className="text-foreground font-semibold">
                      HEPA filtration
                    </dt>
                    <dd>
                      HEPA (high-efficiency particulate air) filtration captures
                      very small particles in the air. We assume that HEPA
                      filtration that achieves the equivalent of 5 air changes
                      per hour{" "}
                      <a href="https://www.doi.org/10.3389/fpubh.2022.1087087">
                        reduces
                      </a>{" "}
                      <a href="https://doi.org/10.1080/02786826.2021.1877257">
                        COVID infections
                      </a>{" "}
                      <a href="https://www.cdc.gov/mmwr/volumes/70/wr/mm7027e1.htm">
                        by 65%
                      </a>
                      .
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-foreground font-semibold">
                      Far UV-C irradiation
                    </dt>
                    <dd>
                      Far UV-C irradiation is a type of ultraviolet irradiation
                      that can have germicidal properties. We assume that
                      appropriate use of far UVC irradiation reduces COVID
                      infections by 90%, a conservative estimate derived from
                      studies estimating the efficacy of far UVC at reducing
                      infective viral load by{" "}
                      <a href="https://www.nature.com/articles/s41598-020-76597-y">
                        90-99.9%
                      </a>{" "}
                      <a href="https://www.doi.org/10.1038/s41598-020-67211-2">
                        over 5-10
                      </a>{" "}
                      <a href="https://www.nature.com/articles/s41598-024-57441-z">
                        minutes
                      </a>{" "}
                      <a href="https://www.nature.com/articles/s41598-022-08462-z">
                        of exposure
                      </a>
                      .
                    </dd>
                  </div>
                </dl>
              </section>
              <section className="space-y-5">
                <h5 className="text-sm font-bold tracking-wide italic">
                  Intervention settings
                </h5>
                <dl className="space-y-6">
                  <div className="space-y-2">
                    <dt className="text-foreground font-semibold">
                      Some common spaces
                    </dt>
                    <dd>
                      Under this scenario, the relevant air cleaning
                      intervention is applied to some shared indoor spaces
                      (e.g., dining halls, waiting rooms) but is not
                      consistently used across buildings. The rate of COVID
                      infections is reduced by the efficacy of the intervention
                      in the proportion of COVID infections attributable to
                      non-household exposures, scaled to reflect limited
                      coverage.
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-foreground font-semibold">
                      Schools and daycares
                    </dt>
                    <dd>
                      Under this scenario, the relevant air cleaning
                      intervention is applied to all indoor spaces in schools
                      and daycares. The rate of COVID infections is reduced by
                      the efficacy of the intervention in the proportion of
                      COVID infections attributable to a pediatric index case.
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="text-foreground font-semibold">
                      All public indoor air
                    </dt>
                    <dd>
                      Under this scenario, the relevant air cleaning
                      intervention is applied to all indoor public spaces. The
                      rate of COVID infections is reduced by the efficacy of the
                      intervention in the proportion of COVID infections
                      attributable to non-household exposures.
                    </dd>
                  </div>
                </dl>
              </section>
            </section>
            <section
              id="pharmaceutical-interventions"
              aria-labelledby="pharmaceutical-heading"
              className="scroll-mt-6 space-y-5 border-t pt-8"
            >
              <h4
                id="pharmaceutical-heading"
                className="text-xl font-bold tracking-tight"
              >
                Pharmaceuticals
              </h4>
              <dl className="space-y-6">
                <div className="space-y-2">
                  <dt className="text-foreground font-semibold">
                    Pre-exposure prophylaxis of COVID-19
                  </dt>
                  <dd>
                    Under this scenario, we assume a hypothetical pre-exposure
                    prophylaxis intervention reduces COVID-19 infections by an
                    amount grounded in existing evidence.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-foreground font-semibold">
                    Post-exposure prophylaxis of COVID-19
                  </dt>
                  <dd>
                    Under this scenario, we assume a hypothetical post-exposure
                    prophylaxis intervention reduces COVID infections by an
                    amount grounded in existing evidence.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-foreground font-semibold">
                    Medication or other treatment for Long COVID symptom
                    reduction
                  </dt>
                  <dd>
                    Under this scenario, we assume a hypothetical medication or
                    other treatment for Long COVID reduces the proportion of
                    persons with Long COVID who progress from having some
                    activity limitations to having significant activity
                    limitations by 10% and reduces the Long COVID-associated
                    disability burden by 10%. Currently, there are no
                    FDA-approved treatments for Long COVID.
                  </dd>
                </div>
              </dl>
            </section>
          </section>
        </article>
      </CardContent>
    </Card>
  );
}
