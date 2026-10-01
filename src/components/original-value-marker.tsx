import { ReferenceDot } from "recharts";
import {
  ORIGINAL_MARKER_HALF_HEIGHT,
  ORIGINAL_MARKER_LABEL_OFFSET,
  type OriginalMarkerPosition,
} from "@/lib/chart-label-layout";

export function OriginalValueMarker({ x, y }: OriginalMarkerPosition) {
  return (
    <ReferenceDot
      x={x}
      y={y}
      ifOverflow="extendDomain"
      stroke="black"
      shape={(props) => {
        if (props.cx !== undefined && props.cy !== undefined) {
          return (
            <g pointerEvents="none">
              <line
                x1={props.cx}
                y1={props.cy + ORIGINAL_MARKER_HALF_HEIGHT}
                x2={props.cx}
                y2={props.cy - ORIGINAL_MARKER_HALF_HEIGHT}
                stroke="black"
              />
              <text
                transform={`translate(${props.cx + ORIGINAL_MARKER_LABEL_OFFSET},${props.cy}) rotate(90)`}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fill="black"
              >
                Original value
              </text>
            </g>
          );
        } else {
          console.error("can't find props.cx or props.cy");
          return <></>;
        }
      }}
    />
  );
}
