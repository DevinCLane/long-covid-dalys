import { useCallback, useState } from "react";
import {
  usePlotArea,
  useXAxisScale,
  useYAxisTicks,
  type LabelProps,
} from "recharts";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  clearOriginalMarkers,
  ORIGINAL_MARKER_HALF_HEIGHT,
  ORIGINAL_MARKER_LABEL_HALF_WIDTH,
  ORIGINAL_MARKER_LABEL_OFFSET,
  type OriginalMarkerPosition,
} from "@/lib/chart-label-layout";

// Reserve a value column on mobile and space for bar-end labels on desktop.
export const MODEL_VALUE_LABEL_MARGIN = 96;

export function ModelBarValueLabel({
  value,
  viewBox,
  showPercent,
  originalMarkers = [],
}: LabelProps & {
  showPercent: boolean;
  originalMarkers?: OriginalMarkerPosition[];
}) {
  const plotArea = usePlotArea();
  const xScale = useXAxisScale();
  const yTicks = useYAxisTicks();
  const isMobile = useIsMobile();
  const formattedValue =
    typeof value === "number"
      ? value !== 0 && Math.abs(value) < 0.1
        ? value > 0
          ? "<0.1"
          : ">−0.1"
        : value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : "";
  const text = `${formattedValue}${showPercent ? "%" : ""}`;
  const [measurement, setMeasurement] = useState({
    text: "",
    width: 0,
    height: 0,
  });
  const measureLabel = useCallback(
    (element: SVGTextElement | null) => {
      if (!element) return;
      const measure = () => {
        const { width, height } = element.getBBox();
        setMeasurement((previous) =>
          previous.text === text &&
          previous.width === width &&
          previous.height === height
            ? previous
            : { text, width, height },
        );
      };
      measure();
      // Recheck when the web font loads or the text's rendered size changes.
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      document.fonts.addEventListener("loadingdone", measure);
      return () => {
        observer.disconnect();
        document.fonts.removeEventListener("loadingdone", measure);
      };
    },
    [text],
  );

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

  const isNegative = value < 0;
  const anchorEnd = isMobile || isNegative;
  const defaultX = isMobile
    ? plotArea.x + plotArea.width + MODEL_VALUE_LABEL_MARGIN - 8
    : isNegative
      ? Math.min(viewBox.x, viewBox.x + viewBox.width) - 8
      : Math.max(viewBox.x, viewBox.x + viewBox.width) + 8;
  const y = viewBox.y + viewBox.height / 2;
  // Use a conservative width until the SVG text can be measured.
  const width = measurement.text === text ? measurement.width : text.length * 8;
  const halfHeight = Math.max(8, measurement.height / 2);
  const markerBounds = originalMarkers.flatMap((marker) => {
    const x = xScale?.(marker.x);
    const markerY = yTicks?.find((tick) => tick.value === marker.y)?.coordinate;
    return x !== undefined && markerY !== undefined
      ? [
          {
            left: x - 1,
            right:
              x +
              ORIGINAL_MARKER_LABEL_OFFSET +
              ORIGINAL_MARKER_LABEL_HALF_WIDTH,
            top: markerY - ORIGINAL_MARKER_HALF_HEIGHT,
            bottom: markerY + ORIGINAL_MARKER_HALF_HEIGHT,
          },
        ]
      : [];
  });
  const left = clearOriginalMarkers(
    {
      left: anchorEnd ? defaultX - width : defaultX,
      right: anchorEnd ? defaultX : defaultX + width,
      top: y - halfHeight,
      bottom: y + halfHeight,
    },
    markerBounds,
  );

  return (
    <text
      ref={measureLabel}
      x={anchorEnd ? left + width : left}
      y={y}
      textAnchor={anchorEnd ? "end" : "start"}
      dominantBaseline="central"
      className="fill-foreground text-xs font-medium tabular-nums"
      pointerEvents="none"
    >
      {text}
    </text>
  );
}
