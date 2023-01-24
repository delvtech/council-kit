import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";

export function GridTableHeader({
  className,
  children,
}: PropsWithChildren<{
  className: string;
}>): ReactElement {
  return (
    <div
      className={classNames(
        "grid grid-flow-col auto-cols-fr text-xs leading-4 font-bold uppercase bg-base-200 rounded-t-lg [&>*]:p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
