import { ReactElement } from "react";
import { Input, InputProps } from "./Input";

export interface NumericInputProps extends InputProps {
  maxButtonValue?: string | number;
  decimals?: number;
}

export function NumericInput({
  value,
  onChange,
  id,
  infoText,
  maxButtonValue,
  placeholder,
  decimals,
}: NumericInputProps): ReactElement {
  return (
    <div className="flex w-full">
      <Input
        value={numberString(value, decimals)}
        onChange={(newValue) => onChange(numberString(newValue, decimals))}
        id={id}
        infoText={infoText}
        placeholder={placeholder}
      />
      {typeof maxButtonValue !== "undefined" && (
        <button
          className="daisy-btn-outline daisy-btn"
          onClick={() => onChange(numberString(maxButtonValue, decimals))}
        >
          Max
        </button>
      )}
    </div>
  );
}

/**
 * Remove any character that's not a number or decimal from a value and return
 * it as a string with a maxButtonValue number of decimals.
 */
function numberString(value: string | number, decimals = 18): string {
  const [integer, fraction] = value
    .toString()
    .replace(/[^.\d]/g, "")
    .split(".");
  if (typeof fraction === "undefined") {
    return integer;
  }
  return `${integer}.${fraction.slice(0, decimals)}`;
}
