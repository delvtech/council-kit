import { ReactNode, PropsWithChildren } from "react";

export function Container({ children }: PropsWithChildren): ReactNode {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-10 px-4">
      {children}
    </div>
  );
}
