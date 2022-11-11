import { PropsWithChildren, ReactElement } from "react";

export function Page({ children }: PropsWithChildren): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col gap-y-10 px-4">
      {children}
    </div>
  );
}
