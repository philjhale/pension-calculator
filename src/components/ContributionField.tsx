import { formatCurrency, parseNumberInput } from '../format';

interface ContributionFieldProps {
  id: string;
  label: string;
  percentage: number;
  salary: number;
  onChange: (percentage: number) => void;
}

export function ContributionField({
  id,
  label,
  percentage,
  salary,
  onChange,
}: ContributionFieldProps) {
  const monthlyAmount = ((percentage / 100) * salary) / 12;

  return (
    <div className="field">
      <label htmlFor={id}>{label} (% of Salary)</label>
      <div className="contribution-row">
        <input
          id={id}
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={percentage}
          onChange={(event) => {
            onChange(parseNumberInput(event.target.value));
          }}
        />
        <output>{formatCurrency(monthlyAmount)}/month</output>
      </div>
    </div>
  );
}
