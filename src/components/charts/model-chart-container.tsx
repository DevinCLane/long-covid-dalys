import type { ComponentProps } from "react";

import { ChartContainer } from "@/components/ui/chart";
import { useDalyModel } from "@/hooks/use-daly-model";
import { cn } from "@/lib/utils";

export function ModelChartContainer({
  className,
  children,
  ...props
}: ComponentProps<typeof ChartContainer>) {
  const { isCustomScenario } = useDalyModel();

  return (
    <div
      className={cn("relative isolate [container-type:inline-size]", className)}
    >
      {isCustomScenario && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none">
          <div className="text-foreground absolute top-1/2 right-[3%] left-[24%] -translate-y-1/2 -rotate-12 text-center opacity-12 dark:opacity-15">
            <p className="text-[clamp(1rem,5cqw,3.5rem)] leading-none font-semibold tracking-[0.06em] uppercase">
              Custom scenario
            </p>
            <p className="mt-3 pr-[12%] text-right text-[clamp(0.625rem,1.8cqw,1rem)] font-medium tracking-[0.3em] uppercase">
              Not validated
            </p>
          </div>
        </div>
      )}
      {/* The translucent watermark sits above the bars without blocking interactions. */}
      <ChartContainer {...props} className="relative z-10 h-full w-full">
        {children}
      </ChartContainer>
    </div>
  );
}
