import { ReactElement } from "react";

interface ErrorMessageProps {
  error: unknown;
}

export function ErrorMessage({ error }: ErrorMessageProps): ReactElement {
  return (
    <div className="daisy-mockup-code">
      <code className="block whitespace-pre-wrap px-6 text-error">
        {error ? (error as any).toString() : "Unknown error"}
      </code>
    </div>
  );
}
