import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";
import { PropsOf } from "src/ui/types";

export type ButtonVariant = "primary" | "secondary" | "stroke";

interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

export function Button({
  variant = "secondary",
  className,
  children,
}: PropsWithChildren<ButtonProps>): ReactElement {
  return (
    <button className={classNames(getButtonClassName(variant), className)}>
      {children}
    </button>
  );
}

interface LinkButtonProps extends ButtonProps {
  href: string;
  target?: PropsOf<"a">["target"];
}

export function LinkButton({
  href,
  target,
  variant = "secondary",
  className,
  children,
}: PropsWithChildren<LinkButtonProps>): ReactElement {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className={classNames(getButtonClassName(variant), className)}
    >
      {children}
    </a>
  );
}

export function getButtonClassName(variant: ButtonVariant = "secondary"): any {
  return classNames(
    "rounded-lg h-11 px-5 flex items-center justify-center gap-2 box-border transition-all font-normal",
    {
      "bg-primary text-white border border-primary hover:bg-primary-hover hover:border-[#7063E5]":
        variant === "primary",
      "bg-white text-black hover:text-primary-hover [&>*]:hover:fill-primary-hover [&>*]:transition-all":
        variant === "secondary",
      "border border-primary-20 text-primary-text-light [&>*]:fill-primary-text-light hover:border-primary-text-light hover:text-white [&>*]:hover:fill-white":
        variant === "stroke",
    },
  );
}
