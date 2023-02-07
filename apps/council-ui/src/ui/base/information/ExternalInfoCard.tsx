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
    <div className="p-4 border border-gray-300 rounded-xl w-fit hover:opacity-50 cursor-pointer select-text flex-1">
      <div className="mb-1">
        <a href={href}>
          <h2 className="font-bold whitespace-nowrap">
            {header} <ExternalLinkSVG size={16} />
          </h2>
        </a>
      </div>
      <h2>{body}</h2>
    </div>
  );
}
