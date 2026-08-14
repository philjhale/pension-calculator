import {
  AVERAGE_PENSION_CHARGES_PERCENTAGE,
  DEFAULT_PENSION_CHARGES_PERCENTAGE,
  VANGUARD_PENSION_CHARGES_PERCENTAGE,
} from '../calculator/constants';
import { parseNumberInput } from '../format';

const PRESETS = [
  { label: 'Vanguard', value: VANGUARD_PENSION_CHARGES_PERCENTAGE },
  { label: 'Average', value: AVERAGE_PENSION_CHARGES_PERCENTAGE },
  { label: 'MoneyHelper', value: DEFAULT_PENSION_CHARGES_PERCENTAGE },
];

interface PensionChargesFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function PensionChargesField({ value, onChange }: PensionChargesFieldProps) {
  return (
    <div className="field">
      <label htmlFor="pension-charges">Pension Charges (%/yr)</label>
      <input
        id="pension-charges"
        type="number"
        min={0}
        step={0.05}
        value={value}
        onChange={(event) => {
          onChange(parseNumberInput(event.target.value));
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
