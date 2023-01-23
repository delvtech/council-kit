import { Classes, Tooltip2, Tooltip2Props } from "@blueprintjs/popover2";
import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";

// Some elements of the tooltip are unreachable through props and must be styled
// using external CSS. We use CSS modules to select only this component followed
// by the `:global` modifier to select the blueprint classes inside of it.
// see https://github.com/css-modules/css-modules#exceptions
import styles from "src/ui/base/Tooltip/Tooltip.module.css";

export function Tooltip({
  className,
  popoverClassName,
  placement = "top",
  interactionKind = "hover",
  ...passThruProps
}: PropsWithChildren<Tooltip2Props>): ReactElement {
  const propsWithDefaults = {
    placement,
    interactionKind,
  };
  return (
    <Tooltip2
      {...passThruProps}
      {...propsWithDefaults}
      className={classNames(
        Classes.TOOLTIP2_INDICATOR,
        "cursor-help",
        className,
      )}
      popoverClassName={classNames(
        styles.popover,
        popoverClassName,
        "max-w-xs",
      )}
    />
  );
}

export function DefinitionTooltip({
  className,
  ...passThruProps
}: PropsWithChildren<Tooltip2Props>): ReactElement {
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

export const definitions = {
  TVP: "Total Voting Power",
};
