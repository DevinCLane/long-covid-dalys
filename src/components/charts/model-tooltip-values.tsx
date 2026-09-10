interface ModelTooltipValuesProps {
  label: string;
  value: number;
  originalValue?: number;
  showPercent: boolean;
}

export function ModelTooltipValues({
  label,
  value,
  originalValue,
  showPercent,
}: ModelTooltipValuesProps) {
  const formatValue = (number: number) =>
    `${number.toLocaleString()}${showPercent ? "%" : ""}`;

  return (
    <div className="grid w-full gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-mono font-medium tabular-nums">
          {formatValue(value)}
        </span>
      </div>
      {originalValue !== undefined && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Original value</span>
          <span className="text-foreground font-mono font-medium tabular-nums">
            {formatValue(originalValue)}
          </span>
        </div>
      )}
    </div>
  );
}
