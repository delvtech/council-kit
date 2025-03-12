import { ChangeEvent, ReactElement, ReactNode } from "react";

export interface InputProps {
  disabled?: boolean;
  id?: string;
  infoText?: ReactNode;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
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
    <div className="daisy-form-control mr-2 w-full">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="daisy-input daisy-input-bordered w-full text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value, e)}
        disabled={disabled}
      />
      {infoText && (
        <label className="daisy-label">
          <span className="daisy-label-text-alt cursor-text select-text">
            {infoText}
          </span>
        </label>
      )}
    </div>
  );
}
