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
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function ResetAll({
  label,
  className,
  onClick,
}: {
  label: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button
      className={cn("cursor-pointer hover:bg-gray-500", className)}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export function ModelAssumptionsPanel() {
  const { assumptions, setAssumption, resetAll } = useDalyModel();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="modelAssumptions">
        <AccordionTrigger className="cursor-pointer text-xl">
          Model Assumptions
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-6 text-balance">
          <div className="italic">
            Modifying assumptions may result in figures that fall outside ranges
            supported by the literature.
          </div>
          <div className="text-right">
            <ResetAll onClick={resetAll} label="Reset All" />
          </div>
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
