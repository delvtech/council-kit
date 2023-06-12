import classNames from "classnames";
import { ReactElement } from "react";

export default function Label({
  className,
  children,
  ...props
}: JSX.IntrinsicElements["label"]): ReactElement {
  return (
    <label
      className={classNames("block text-lg font-bold", className)}
      {...props}
    >
      {children}
    </label>
  );
}
