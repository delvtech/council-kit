import classNames from "classnames";
import Link from "next/link";
import { PropsWithChildren, ReactElement } from "react";
import { UrlObject } from "url";

/**
 * A div with `display: grid` pretending to be a table row :).
 * To customize column widths use the `grid-cols-[<col-widths>]` className.
 * @see https://tailwindcss.com/docs/grid-template-columns#using-custom-values
 */
export function GridTableRowLink({
  href,
  className,
  children,
}: PropsWithChildren<{
  href: string | UrlObject;
  className?: string;
}>): ReactElement {
  return (
    <Link
      href={href}
      className={classNames(
        "grid grid-flow-col auto-cols-fr odd:bg-base-200 last:rounded-b-lg [&>*]:p-4 [&>*]:overflow-hidden [&>*]:text-ellipsis hover:bg-base-300 transition-all",
        className,
      )}
    >
      {children}
    </Link>
  );
}
