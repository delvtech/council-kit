import { ReactElement } from "react";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";

interface ExternalInfoCardProps {
  header: string;
  body: string;
  href: string;
}

export function ExternalInfoCard({
  header,
  body,
  href,
}: ExternalInfoCardProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-4 border border-gray-300 hover:border-black rounded-xl w-fit hover:text-black cursor-pointer select-text flex-1"
    >
      <h2 className="font-bold mb-1">
        {header} <ExternalLinkSVG size={16} />
      </h2>
      <p>{body}</p>
    </a>
  );
}
