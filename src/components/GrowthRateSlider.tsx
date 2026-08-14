const PRESETS = [
  { label: 'Low', value: 2 },
  { label: 'Medium', value: 5 },
  { label: 'High', value: 8 },
];

interface GrowthRateSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function GrowthRateSlider({ value, onChange }: GrowthRateSliderProps) {
  return (
    <div className="field">
      <label htmlFor="growth-rate">Growth Rate: {value}%</label>
      <input
        id="growth-rate"
        type="range"
        min={0}
        max={12}
        step={0.1}
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
      />
      <div className="preset-buttons">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            aria-pressed={value === preset.value}
            onClick={() => {
              onChange(preset.value);
            }}
          >
            {preset.label} ({preset.value}%)
          </button>
        ))}
      </div>
    </div>
  );
}
