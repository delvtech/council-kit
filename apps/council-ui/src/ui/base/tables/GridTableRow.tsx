import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";

export interface GridTableRowProps {
  className?: string;
  /**
   * Add a bg to odd rows (zebra striping).
   */
  zebra?: boolean;
}

/**
 * A div with `display: grid` pretending to be a table row :).
 * To customize column widths use the `grid-cols-[<col-widths>]` className.
 * @see https://tailwindcss.com/docs/grid-template-columns#using-custom-values
 */
export function GridTableRow({
  className,
  children,
  zebra = true,
}: PropsWithChildren<GridTableRowProps>): ReactElement {
  return (
    <div
      className={classNames(
        "grid grid-flow-col auto-cols-fr last:rounded-b-lg [&>*]:p-4 [&>*]:overflow-hidden [&>*]:text-ellipsis",
        {
          "odd:bg-base-200": zebra,
          "border-b border-base-200": !zebra,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
