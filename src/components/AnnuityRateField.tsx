import {
  DEFAULT_ANNUITY_RATE_PERCENTAGE,
  MAX_ANNUITY_RATE_PERCENTAGE,
  MIN_ANNUITY_RATE_PERCENTAGE,
  MONEYHELPER_ANNUITY_RATE_PERCENTAGE,
} from '../calculator/constants';
import { parseNumberInput } from '../format';

const PRESETS = [
  { label: 'Vanguard', value: DEFAULT_ANNUITY_RATE_PERCENTAGE },
  { label: 'MoneyHelper', value: MONEYHELPER_ANNUITY_RATE_PERCENTAGE },
];

interface AnnuityRateFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function AnnuityRateField({ value, onChange }: AnnuityRateFieldProps) {
  return (
    <div className="field">
      <label htmlFor="annuity-rate">Annuity Rate (%)</label>
      <input
        id="annuity-rate"
        type="number"
        min={MIN_ANNUITY_RATE_PERCENTAGE}
        max={MAX_ANNUITY_RATE_PERCENTAGE}
        step={0.01}
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
