import classNames from "classnames";
import { PropsWithChildren, ReactElement } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

interface PageProps {
  className?: string;
}

export function Page({
  children,
  className,
}: PropsWithChildren<PageProps>): ReactElement {
  return (
    // https://daisyui.com/docs/colors
    <SkeletonTheme
      baseColor="oklch(var(--b3))"
      highlightColor="oklch(var(--b1))"
    >
      <div
        className={classNames(
          "bg-base m-auto my-16 flex max-w-6xl flex-col gap-y-10 px-4",
          className,
        )}
      >
        {children}
      </div>
    </SkeletonTheme>
  );
}
