import { useState, type ChangeEvent } from 'react';
import { parseNumberInput } from '../format';

/**
 * Keeps a number input's displayed text decoupled from its committed
 * numeric value, so clearing the field doesn't get force-rewritten to "0"
 * (which would otherwise glue the next keystroke onto that leftover zero).
 */
export function useNumberInput(value: number, onChange: (value: number) => void) {
  const [text, setText] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);

  // Adjust state during render (React's recommended alternative to an
  // effect here) only when the value changed for a reason other than this
  // input's own edit — never fight the text the user is actively typing.
  if (prevValue !== value) {
    setPrevValue(value);
    if (parseNumberInput(text) !== value) {
      setText(String(value));
    }
  }

  return {
    text,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
      onChange(parseNumberInput(event.target.value));
    },
  };
}
