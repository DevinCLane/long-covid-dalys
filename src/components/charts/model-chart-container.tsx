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
    <div className={cn("relative", className)}>
      <ChartContainer {...props} className="h-full w-full">
        {children}
      </ChartContainer>
      {isCustomScenario && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <p className="bg-background/85 text-muted-foreground rounded-md px-3 py-2 text-center text-sm font-medium sm:text-lg">
            Custom scenario · Not validated
          </p>
        </div>
      )}
    </div>
  );
}
