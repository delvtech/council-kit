import { Replace } from "@delvtech/drift";
import { fixed, parseFixed } from "@delvtech/fixed-point-wasm";
import { ReactElement, useState } from "react";
import { Input, InputProps } from "src/ui/base/forms/Input";

export type NumericInputProps = Replace<
  InputProps,
  {
    value: bigint;
    onChange: (value: bigint) => void;
    maxButtonValue?: bigint;
    decimals?: number;
  }
>;

export function NumericInput({
  value,
  onChange,
  placeholder = "0.0",
  maxButtonValue,
  decimals,
  disabled,
  ...rest
}: NumericInputProps): ReactElement {
  const [stringValue, setStringValue] = useState(
    value > 0n ? fixed(value, decimals).format() : "",
  );
  const fixedValue = parseFixed(stringValue, decimals);
  const displayValue =
    fixedValue.eq(value, decimals) && fixedValue.gte(0n)
      ? stringValue
      : fixed(value, decimals).format();

  return (
    <div className="flex w-full">
      <Input
        value={displayValue}
        onChange={(newValue, e) => {
          e.preventDefault();
          try {
            const parsed = parseFixed(newValue, decimals);
            if (parsed.gte(0n)) {
              setStringValue(newValue);
              onChange(parsed.bigint);
            }
          } catch {}
        }}
        placeholder={placeholder}
        {...rest}
      />
      {typeof maxButtonValue !== "undefined" && (
        <button
          className="daisy-btn"
          onClick={() => onChange(maxButtonValue)}
          disabled={disabled}
        >
          Max
        </button>
      )}
    </div>
  );
}

/**
 * Remove any character that's not a number or decimal from a value and return
 * it as a string with a max number of decimals.
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
