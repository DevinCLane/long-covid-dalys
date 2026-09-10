import { ReferenceDot } from "recharts";

interface OriginalValueMarkerProps {
  x: number;
  y: string;
}
export function OriginalValueMarker({ x, y }: OriginalValueMarkerProps) {
  return (
    <ReferenceDot
      x={x}
      y={y}
      stroke="black"
      label={{
        value: "Original value",
        fill: "black",
        // position: "insideBottomRight",
        angle: 90,
        dx: 20,
      }}
      shape={(props) => {
        if (props.cx !== undefined && props.cy !== undefined) {
          return (
            <line
              x1={props.cx}
              y1={props.cy + 50}
              x2={props.cx}
              y2={props.cy - 50}
              stroke="black"
            ></line>
          );
        } else {
          console.error("can't find props.cx or props.cy");
          return <></>;
        }
      }}
    />
  );
}
