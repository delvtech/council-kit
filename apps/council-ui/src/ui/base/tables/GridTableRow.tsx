import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";

export function GridTableRow({
  className,
  children,
}: PropsWithChildren<{
  className: string;
}>): ReactElement {
  return (
    <div
      className={classNames(
        "group grid grid-flow-col auto-cols-fr odd:bg-base-200 transition-all last:rounded-b-lg [&>*]:p-4 [&>*]:flex [&>*]:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
