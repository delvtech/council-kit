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
    <div className="p-4 border border-gray-300  rounded-xl w-fit hover:opacity-80 cursor-pointer select-text">
      <div className="mb-1">
        <a href={href}>
          <h2 className="font-bold">
            {header} <ExternalLinkSVG />
          </h2>
        </a>
      </div>
      <h2>{body}</h2>
    </div>
  );
}
