import { ReactElement, ReactNode } from "react";

export interface InputProps {
  disabled: boolean;
  id?: string;
  infoText?: ReactNode;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string | number;
}

export function Input({
  disabled = false,
  id,
  infoText,
  onChange,
  placeholder,
  value,
}: InputProps): ReactElement {
  return (
    <div className="w-full mr-2 daisy-form-control">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="w-full text-lg daisy-input-bordered daisy-input"
        value={value}
        onChange={({ target }) => onChange(target.value)}
        disabled={disabled}
      />
      {infoText && (
        <label className="daisy-label">
          <span className="select-text daisy-label-text-alt cursor-text">
            {infoText}
          </span>
        </label>
      )}
    </div>
  );
}
