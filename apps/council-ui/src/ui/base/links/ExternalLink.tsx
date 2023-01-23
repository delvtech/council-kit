import classNames from "classnames";
import { ReactElement, ReactNode } from "react";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  iconSize?: number;
  className?: string;
}

export default function ExternalLink({
  href,
  children,
  iconSize = 16,
  className,
}: ExternalLinkProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classNames(
        "daisy-link daisy-link-hover inline-flex items-center",
        className,
      )}
    >
      {children} <ExternalLinkSVG size={iconSize} />
    </a>
  );
}
