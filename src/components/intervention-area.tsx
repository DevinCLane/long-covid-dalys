import { Checkbox } from "@/components/ui/checkbox";
import { InterventionsSlider } from "@/components/interventions-slider";

interface InterventionAreaProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel?: string;
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

export function InterventionArea({
  id,
  checked,
  onCheckedChange,
  ariaLabel,
  sliderLabel,
  sliderSubLabel,
  sliderMin,
  sliderMax,
  sliderStep,
  sliderInitialValue,
  sliderDefaultValue,
  sliderDisabled,
  onSliderChange,
}: InterventionAreaProps) {
  return (
    <div className="mt-4 flex gap-x-4 text-left">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <div className="grid w-full gap-0.5 leading-none">
        <label htmlFor={id} className="sr-only">
          {ariaLabel}
        </label>
        <div className="w-[90%]">
          <InterventionsSlider
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
