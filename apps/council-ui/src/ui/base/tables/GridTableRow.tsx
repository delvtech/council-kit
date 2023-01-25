import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";

/**
 * A div with `display: grid` pretending to be a table row :).
 * To customize column widths use the `grid-cols-[<col-widths>]` className.
 * @see https://tailwindcss.com/docs/grid-template-columns#using-custom-values
 */
export function GridTableRow({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>): ReactElement {
  return (
    <div
      className={classNames(
        "grid grid-flow-col auto-cols-fr odd:bg-base-200 last:rounded-b-lg [&>*]:p-4 [&>*]:overflow-hidden [&>*]:text-ellipsis",
        className,
      )}
    >
      {children}
    </div>
  );
}
