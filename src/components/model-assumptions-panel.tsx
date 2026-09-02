import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AssumptionArea } from "@/components/assumption-area";
import { useDalyModel } from "@/hooks/use-daly-model";
import {
  ASSUMPTIONS,
  GROUP_LABELS,
  getAssumptionSliderMax,
} from "@/config/assumptions";

export function ModelAssumptionsPanel() {
  const { assumptions, setAssumption } = useDalyModel();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="modelAssumptions">
        <AccordionTrigger className="cursor-pointer text-xl">
          Model Assumptions
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-6 text-balance">
          {Object.entries(GROUP_LABELS).map(([group, groupLabel]) => (
            <section key={group}>
              <h3 className="text-lg font-medium">{groupLabel}</h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                {ASSUMPTIONS.filter(
                  (assumption) => assumption.group === group,
                ).map((assumption) => (
                  <AssumptionArea
                    key={assumption.key}
                    sliderLabel={assumption.sliderLabel}
                    sliderSubLabel={assumption.sliderSubLabel}
                    sliderMin={assumption.sliderMin}
                    sliderMax={getAssumptionSliderMax(
                      assumption.key,
                      assumptions,
                    )}
                    sliderStep={assumption.sliderStep}
                    sliderValue={assumptions[assumption.key]}
                    sliderDefaultValue={assumption.defaultValue}
                    sliderDisabled={false}
                    onSliderChange={(value) =>
                      setAssumption(assumption.key, value)
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
