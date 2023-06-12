import classNames from "classnames";
import { ReactElement } from "react";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  color?: "primary" | "secondary";
};

export default function Button({
  className,
  color = "primary",
  children,
  ...props
}: ButtonProps): ReactElement {
  return (
    <button
      className={classNames(
        "flex w-full text-xs uppercase whitespace-nowrap gap-2 items-center justify-center rounded-md px-10 py-2 hover:opacity-70",
        className,
        {
          "bg-black text-white ": color === "primary",
          "bg-zinc-200 text-black": color === "secondary",
        },
      )}
      {...props}
    >
      {children}
    </button>
  );
}
