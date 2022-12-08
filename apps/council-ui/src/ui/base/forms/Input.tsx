import { ReactElement, ReactNode } from "react";

export interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  id?: string;
  infoText?: ReactNode;
  placeholder?: string;
}

export function Input({
  value,
  onChange,
  id,
  infoText,
  placeholder,
}: InputProps): ReactElement {
  return (
    <div className="daisy-form-control mr-2 w-full">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="daisy-input-bordered daisy-input w-full text-lg"
        value={value}
        onChange={({ target }) => onChange(target.value)}
      />
      {infoText && (
        <label className="daisy-label">
          <span className="daisy-label-text-alt">{infoText}</span>
        </label>
      )}
    </div>
  );
}
