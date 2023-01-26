import classNames from "classnames";
import { ReactElement } from "react";
// TODO: Add dependency-cruiser rule to enforce nobody imports directly from
// react-tooltip outside of this file and app.tsx.
import { ITooltipWrapper, TooltipWrapper } from "react-tooltip";

// Re-exporting for naming only is usually bad, but in this case it's worth it
// since TooltipWrapper isn't intuitive to remember and react-tooltip has a
// `Tooltip` component that we *shouldn't use*.
export const Tooltip = TooltipWrapper;

export function DefinitionTooltip({
  className,
  ...passThruProps
}: ITooltipWrapper): ReactElement {
  return (
    <TooltipWrapper
      {...passThruProps}
      className={classNames(
        "cursor-help border-b border-dotted border-current",
        className,
      )}
    />
  );
}
