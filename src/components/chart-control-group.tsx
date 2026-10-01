import type { ReactNode } from "react";

export function ChartControlGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="w-full min-w-0 text-left sm:w-fit sm:flex-none">
      <legend className="text-muted-foreground mb-2 px-1 text-xs font-medium">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
