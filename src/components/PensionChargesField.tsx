import {
  AVERAGE_PENSION_CHARGES_PERCENTAGE,
  DEFAULT_PENSION_CHARGES_PERCENTAGE,
  VANGUARD_PENSION_CHARGES_PERCENTAGE,
} from '../calculator/constants';
import { useNumberInput } from '../hooks/useNumberInput';

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
  const { text, handleChange } = useNumberInput(value, onChange);

  return (
    <div className="field">
      <label htmlFor="pension-charges">Pension Charges (%/yr)</label>
      <input
        id="pension-charges"
        type="number"
        min={0}
        step={0.05}
        value={text}
        onChange={handleChange}
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
