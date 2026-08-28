import { useNumberInput } from '../hooks/useNumberInput';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  fullWidth?: boolean;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  fullWidth,
}: NumberFieldProps) {
  const { text, handleChange } = useNumberInput(value, onChange);

  return (
    <div className={fullWidth ? 'field field-full' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}
