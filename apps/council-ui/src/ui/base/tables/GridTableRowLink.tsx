import classNames from "classnames";
import Link from "next/link";
import { PropsWithChildren, ReactElement } from "react";
import { UrlObject } from "url";

export interface GridTableRowLinkProps {
  href: string | UrlObject;
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
export function GridTableRowLink({
  href,
  className,
  children,
  zebra = true,
}: PropsWithChildren<GridTableRowLinkProps>): ReactElement {
  return (
    <Link
      href={href}
      className={classNames(
        "grid grid-flow-col auto-cols-fr last:rounded-b-lg [&>*]:p-4 [&>*]:overflow-hidden [&>*]:text-ellipsis hover:bg-base-300 transition-all",
        {
          "odd:bg-base-200": zebra,
          "border-b border-base-200 last:border-none": !zebra,
        },
        className,
      )}
    >
      {children}
    </Link>
  );
}
