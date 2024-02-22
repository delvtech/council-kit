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
        "daisy-label flex cursor-pointer items-center gap-1 whitespace-nowrap",
        className,
      )}
    >
      <BuildingLibraryIcon className="mb-[2px] size-5 fill-warning" />
      <span className="daisy-label-text mr-1 font-medium">Show GSC Only</span>
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
