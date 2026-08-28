import { formatCurrency } from '../format';
import { useNumberInput } from '../hooks/useNumberInput';

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
  const { text, handleChange } = useNumberInput(percentage, onChange);

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
          value={text}
          onChange={handleChange}
        />
        <output>{formatCurrency(monthlyAmount)}/mo</output>
      </div>
    </div>
  );
}
