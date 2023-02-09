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
    <SkeletonTheme baseColor="hsl(var(--b3))" highlightColor="hsl(var(--b1))">
      <div
        className={classNames(
          "flex flex-col max-w-6xl px-4 m-auto my-16 gap-y-10 bg-base",
          className,
        )}
      >
        {children}
      </div>
    </SkeletonTheme>
  );
}
