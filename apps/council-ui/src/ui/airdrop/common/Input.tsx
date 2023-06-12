import classNames from "classnames";
import { ReactElement } from "react";

export default function Input({
  className,
  ...props
}: JSX.IntrinsicElements["input"]): ReactElement {
  return (
    <input
      className={classNames(
        "block w-full p-1 rounded-lg border border-zinc-500 px-3",
        className,
      )}
      {...props}
    />
  );
}
