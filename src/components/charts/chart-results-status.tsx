import { useEffect, useState } from "react";

export interface AccessibleChartData {
  id: string;
  label: string;
  value: number;
  originalValue?: number;
}

export interface ChartResultsStatusProps {
  description: string;
  valueLabel: string;
  showPercent: boolean;
  isCustomScenario: boolean;
  rows: AccessibleChartData[];
}

export function ChartResultsStatus({
  description,
  valueLabel,
  showPercent,
  isCustomScenario,
  rows,
}: ChartResultsStatusProps) {
  const [announcement, setAnnouncement] = useState("");
  // Debounce rapid slider changes; announce context without repeating every value.
  const resultKey = JSON.stringify(rows);
  const summary = `${description}. ${rows.length} results. ${isCustomScenario ? "Custom scenario. Not validated. Original values use default assumptions." : "Default model assumptions."} Use Left and Right arrow keys to explore values.${showPercent || /averted/i.test(valueLabel) ? " Negative values indicate increased DALYs." : ""}`;
  useEffect(() => {
    const clearTimer = window.setTimeout(() => setAnnouncement(""), 50);
    const timer = window.setTimeout(
      () => setAnnouncement(`Chart results updated. ${summary}`),
      400,
    );
    return () => {
      window.clearTimeout(clearTimer);
      window.clearTimeout(timer);
    };
  }, [resultKey, summary]);

  return (
    <p role="status" aria-atomic="true" className="sr-only">
      {announcement}
    </p>
  );
}
