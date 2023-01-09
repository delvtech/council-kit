import { ReactElement } from "react";

interface ErrorMessageProps {
  error: unknown;
}

export function ErrorMessage({ error }: ErrorMessageProps): ReactElement {
  return (
    <div className="daisy-mockup-code">
      <code className="block px-6 whitespace-pre-wrap text-error">
        {error ? (error as any).toString() : "Unknown error"}
      </code>
    </div>
  );
}
