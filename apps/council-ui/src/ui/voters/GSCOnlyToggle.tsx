import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ReactElement } from "react";

interface GSCOnlyToggleOptions {
  on: boolean;
  onToggle: (on: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function GSCOnlyToggle({
  on,
  onToggle,
  disabled,
  className,
}: GSCOnlyToggleOptions): ReactElement {
  return (
    <label
      className={classNames(
        "flex items-center gap-1 cursor-pointer daisy-label whitespace-nowrap",
        className,
      )}
    >
      <BuildingLibraryIcon className="w-5 h-5 fill-warning mb-[2px]" />
      <span className="mr-1 font-medium daisy-label-text">GSC Only</span>
      <input
        type="checkbox"
        className="daisy-toggle daisy-toggle-warning"
        checked={on}
        onChange={({ target }) => onToggle(target.checked)}
        disabled={disabled}
      />
    </label>
  );
}
