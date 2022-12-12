import { ReactElement } from "react";
import ExternalLink from "src/ui/base/links/ExternalLink";

interface VaultHeaderProps {
  descriptionURL: string | undefined;
  name: string | undefined;
}

export default function VaultHeader({
  descriptionURL,
  name,
}: VaultHeaderProps): ReactElement {
  return (
    <div>
      {descriptionURL ? (
        <ExternalLink href={descriptionURL} iconSize={30}>
          {name}
        </ExternalLink>
      ) : (
        <h1 className="text-5xl font-bold">{name}</h1>
      )}
    </div>
  );
}
