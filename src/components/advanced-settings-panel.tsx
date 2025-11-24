"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionsSlider } from "@/components/interventions-slider";
import { ADVANCED_SETTINGS, AdvancedSetting } from "@/config/advanced-settings";

interface AdvancedSettingsPanelProps {
  settings: Record<string, number>;
  onSettingsChange: (key: string, value: number) => void;
  onReset: () => void;
}

export function AdvancedSettingsPanel({
  settings,
  onSettingsChange,
  onReset,
}: AdvancedSettingsPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSliderChange = (key: string) => (value: number[]) => {
    onSettingsChange(key, value[0]);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Settings</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="text-xs"
            >
              Reset to Defaults
            </Button>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Adjust model assumptions to explore different scenarios. These
            settings modify the base scenario calculations.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ADVANCED_SETTINGS.map((setting) => (
              <AdvancedSettingSlider
                key={setting.key}
                setting={setting}
                value={settings[setting.key] ?? setting.defaultValue}
                onChange={handleSliderChange(setting.key)}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface AdvancedSettingSliderProps {
  setting: AdvancedSetting;
  value: number;
  onChange: (value: number[]) => void;
}

function AdvancedSettingSlider({
  setting,
  value,
  onChange,
}: AdvancedSettingSliderProps) {
  const formatValue = (val: number): string => {
    if (setting.unit === "%") {
      return `${val.toFixed(setting.step < 1 ? 1 : 0)}%`;
    }
    if (setting.unit === "DALYs/year") {
      return `${val.toFixed(2)}`;
    }
    return val.toFixed(setting.step < 1 ? 1 : 0);
  };

  return (
    <div>
      <InterventionsSlider
        label={setting.label}
        sublabel={setting.description}
        minValue={setting.min}
        maxValue={setting.max}
        step={setting.step}
        initialValue={[value]}
        defaultValue={[setting.defaultValue]}
        onValueChange={onChange}
      />
      <div className="mt-1 text-xs text-muted-foreground">
        Current: {formatValue(value)}
        {setting.unit && ` ${setting.unit}`}
      </div>
    </div>
  );
}
