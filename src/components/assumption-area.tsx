import { AssumptionSlider } from "@/components/assumption-slider";

interface AssumptionAreaProps {
  sliderLabel: string;
  sliderSubLabel: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  sliderInitialValue: number;
  sliderDefaultValue: number;
  sliderDisabled: boolean;
  onSliderChange: (value: number[]) => void;
}

export function AssumptionArea({
  sliderLabel,
  sliderSubLabel,
  sliderMin,
  sliderMax,
  sliderStep,
  sliderInitialValue,
  sliderDefaultValue,
  sliderDisabled,
  onSliderChange,
}: AssumptionAreaProps) {
  return (
    <div className="mt-4 flex gap-x-4 text-left">
      <div className="grid w-full gap-0.5 leading-none">
        <div className="m-4">
          <AssumptionSlider
            label={sliderLabel}
            sublabel={sliderSubLabel}
            minValue={sliderMin}
            maxValue={sliderMax}
            step={sliderStep}
            initialValue={[sliderInitialValue]}
            defaultValue={[sliderDefaultValue]}
            disabled={sliderDisabled}
            onValueChange={onSliderChange}
          />
        </div>
      </div>
    </div>
  );
}
