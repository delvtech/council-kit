import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import ExternalLink from "src/ui/base/links/ExternalLink";

interface VaultHeaderProps {
  descriptionURL: string | undefined;
  name: string | undefined;
}

export function VaultHeader({
  descriptionURL,
  name,
}: VaultHeaderProps): ReactElement {
  return (
    <div>
      {descriptionURL ? (
        <ExternalLink href={descriptionURL} iconSize={30}>
          <h1 className="inline text-5xl font-bold">{name}</h1>
        </ExternalLink>
      ) : (
        <h1 className="text-5xl font-bold">{name}</h1>
      )}
    </div>
  );
}

export function VaultHeaderSkeleton(): ReactElement {
  return (
    <div className="w-72">
      <Skeleton className="h-12" />
    </div>
  );
}
