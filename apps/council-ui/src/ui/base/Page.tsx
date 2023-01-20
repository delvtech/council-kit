import { PropsWithChildren, ReactElement } from "react";

export function Page({ children }: PropsWithChildren): ReactElement {
  return (
    <div className="flex flex-col max-w-6xl px-4 m-auto mt-16 gap-y-10">
      {children}
    </div>
  );
}
