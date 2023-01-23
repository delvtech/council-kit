import { ReactElement, ReactNode } from "react";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  iconSize?: number;
}

export default function ExternalLink({
  href,
  children,
  iconSize = 16,
}: ExternalLinkProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="daisy-link daisy-link-hover inline-flex self-start items-center"
    >
      {children} <ExternalLinkSVG size={iconSize} />
    </a>
  );
}
