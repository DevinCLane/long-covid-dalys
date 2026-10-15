import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SCENARIO_LABELS_BY_ID } from "@/config/scenario-daly-calculations";
import { scenarioDescriptions } from "@/config/chart-label-descriptions";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface ModelYAxisTickProps {
  x?: string | number;
  y?: string | number;
  payload?: { value?: string | number };
  label?: string;
  description?: string;
  labelWidth?: number;
  maxChars?: number;
  wrapHyphens?: boolean;
}

const LINE_HEIGHT = 13;

export function ModelYAxisTick({
  x = 0,
  y = 0,
  payload,
  label = String(payload?.value ?? ""),
  description,
  labelWidth = 132,
  maxChars = 17,
  wrapHyphens = false,
}: ModelYAxisTickProps) {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const lines: string[] = [];
  for (const word of label.split(wrapHyphens ? /[\s-]+/ : /\s+/)) {
    const currentLine = lines[lines.length - 1];
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (!currentLine || nextLine.length > maxChars) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = nextLine;
    }
  }
  const labelHeight = lines.length * LINE_HEIGHT + 6;
  const firstLineDy = 4 - ((lines.length - 1) * LINE_HEIGHT) / 2;

  return (
    <Tooltip
      delayDuration={200}
      open={isOpen}
      onOpenChange={(open) => {
        // Scrolling a focused label into view must not dismiss its definition.
        if (open || !isFocused) setIsOpen(open);
      }}
    >
      <TooltipTrigger asChild>
        <g
          transform={`translate(${x},${y})`}
          role="img"
          tabIndex={0}
          aria-label={label}
          className="group cursor-default outline-none"
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsOpen(false);
          }}
        >
          <rect
            x={-labelWidth - 4}
            y={-labelHeight / 2}
            width={labelWidth + 8}
            height={labelHeight}
            rx={4}
            fill="transparent"
            stroke={isFocused ? "var(--ring)" : "transparent"}
            strokeWidth={1.5}
            pointerEvents="all"
          />
          <text
            x={0}
            y={0}
            textAnchor="end"
            className="fill-muted-foreground group-hover:fill-foreground group-focus:fill-foreground text-xs"
          >
            {lines.map((line, index) => (
              <tspan
                key={`${line}-${index}`}
                x={0}
                dy={index === 0 ? firstLineDy : LINE_HEIGHT}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      </TooltipTrigger>
      <TooltipContent
        side={isMobile ? "top" : "right"}
        sideOffset={8}
        collisionPadding={12}
        onEscapeKeyDown={() => setIsOpen(false)}
        className="max-w-64 px-2 py-1 text-xs text-wrap"
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
}

export function ScenarioYAxisTick({
  payload,
  label,
  ...props
}: ModelYAxisTickProps) {
  const value = String(payload?.value ?? "");
  return (
    <ModelYAxisTick
      {...props}
      payload={payload}
      label={label ?? SCENARIO_LABELS_BY_ID.get(value) ?? value}
      description={scenarioDescriptions[value]}
    />
  );
}
