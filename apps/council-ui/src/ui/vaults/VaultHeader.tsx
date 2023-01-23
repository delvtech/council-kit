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
  const vaultName = <h1 className="text-5xl font-bold">{name}</h1>;
  if (!descriptionURL) {
    return vaultName;
  }

  return (
    <div className="flex flex-col gap-1">
      <h1 className="inline text-5xl font-bold">{name}</h1>
      <ExternalLink href={descriptionURL} iconSize={18} className="self-start">
        <span>Learn more about this vault</span>
      </ExternalLink>
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
