import { PropsWithChildren, ReactElement } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

export function Page({ children }: PropsWithChildren): ReactElement {
  return (
    // https://daisyui.com/docs/colors
    <SkeletonTheme baseColor="hsl(var(--b3))" highlightColor="hsl(var(--b1))">
      <div className="flex flex-col max-w-6xl px-4 m-auto my-16 gap-y-10 bg-bas">
        {children}
      </div>
    </SkeletonTheme>
  );
}
