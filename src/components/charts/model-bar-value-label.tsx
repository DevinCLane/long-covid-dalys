import { usePlotArea, type LabelProps } from "recharts";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Reserve a value column on mobile and space for bar-end labels on desktop.
export const MODEL_VALUE_LABEL_MARGIN = 64;

export function ModelBarValueLabel({
  value,
  viewBox,
  showPercent,
}: LabelProps & { showPercent: boolean }) {
  const plotArea = usePlotArea();
  const isMobile = useIsMobile();

  if (
    !plotArea ||
    !viewBox ||
    !("x" in viewBox) ||
    typeof viewBox.x !== "number" ||
    typeof viewBox.y !== "number" ||
    typeof viewBox.width !== "number" ||
    typeof viewBox.height !== "number" ||
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  // Keep small nonzero results distinguishable from an actual zero.
  const formattedValue =
    value !== 0 && Math.abs(value) < 0.1
      ? value > 0
        ? "<0.1"
        : ">−0.1"
      : value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  const isNegative = value < 0;

  return (
    <text
      x={
        isMobile
          ? plotArea.x + plotArea.width + MODEL_VALUE_LABEL_MARGIN - 8
          : isNegative
            ? Math.min(viewBox.x, viewBox.x + viewBox.width) - 8
            : Math.max(viewBox.x, viewBox.x + viewBox.width) + 8
      }
      y={viewBox.y + viewBox.height / 2}
      textAnchor={isMobile || isNegative ? "end" : "start"}
      dominantBaseline="central"
      className="fill-foreground text-xs font-medium tabular-nums"
      pointerEvents="none"
    >
      {formattedValue}
      {showPercent ? "%" : ""}
    </text>
  );
}
