import { useCallback, useEffect, useState } from "react";

type UseSliderWithInputProps = {
  value: number;
  minValue: number;
  maxValue: number;
  step?: number;
  defaultValue: number;
  onValueChange?: (value: number) => void;
};

function decimalsForStep(step?: number) {
  if (!step || Number.isInteger(step)) return 0;
  return Math.min(8, step.toString().split(".")[1]?.length ?? 0);
}

function formatValue(value: number, step?: number) {
  return Number(value.toFixed(decimalsForStep(step))).toString();
}

export function useSliderWithInput({
  value,
  minValue,
  maxValue,
  step,
  defaultValue,
  onValueChange,
}: UseSliderWithInputProps) {
  const [inputValue, setInputValue] = useState(() => formatValue(value, step));

  useEffect(() => {
    setInputValue(formatValue(value, step));
  }, [step, value]);

  const validateAndUpdateValue = useCallback(
    (rawValue: string) => {
      const parsedValue = Number.parseFloat(rawValue);
      const nextValue = Number.isFinite(parsedValue)
        ? Math.min(maxValue, Math.max(minValue, parsedValue))
        : value;

      setInputValue(formatValue(nextValue, step));
      onValueChange?.(nextValue);
    },
    [maxValue, minValue, onValueChange, step, value],
  );

  const handleInputChange = useCallback((rawValue: string) => {
    if (rawValue === "" || /^-?\d*\.?\d*$/.test(rawValue)) {
      setInputValue(rawValue);
    }
  }, []);

  const handleSliderChange = useCallback(
    (newValue: number[]) => {
      const nextValue = newValue[0] ?? minValue;
      setInputValue(formatValue(nextValue, step));
      onValueChange?.(nextValue);
    },
    [minValue, onValueChange, step],
  );

  const resetToDefault = useCallback(() => {
    setInputValue(formatValue(defaultValue, step));
    onValueChange?.(defaultValue);
  }, [defaultValue, onValueChange, step]);

  return {
    inputValue,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
  };
}
