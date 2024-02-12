import classNames from "classnames";
import { ReactElement } from "react";
// TODO: Add dependency-cruiser rule to enforce nobody imports directly from
// react-tooltip outside of this file and app.tsx.
import {
  Tooltip as BaseTooltip,
  PlacesType,
  PositionStrategy,
  VariantType,
} from "react-tooltip";

export interface ToolTipOptions
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  content: string;
  place?: PlacesType;
  positionStrategy?: PositionStrategy;
  variant?: VariantType;
}

// Re-exporting to simplify the API and enforce proper usage.
export function Tooltip({
  content,
  place = "top",
  positionStrategy,
  variant,
  children,
  ...passThruProps
}: ToolTipOptions): ReactElement {
  return (
    <>
      <a
        {...passThruProps}
        data-tooltip-id="tooltipsy"
        data-tooltip-content={content}
        data-tooltip-place={place}
        data-tooltip-variant={variant}
        data-tooltip-position-strategy={positionStrategy}
      >
        {children}
      </a>
      <BaseTooltip id="tooltipsy" />
    </>
  );
}

export function DefinitionTooltip({
  className,
  ...passThruProps
}: ToolTipOptions): ReactElement {
  return (
    <Tooltip
      {...passThruProps}
      className={classNames(
        "cursor-help border-b border-dotted border-current",
        className,
      )}
    />
  );
}
