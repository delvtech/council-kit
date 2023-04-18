import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { VaultProfileCard } from "./VaultProfileCard";

interface VaultProfileCardSkeletonProps {
  name: string;
  address: string;
  buttonText?: string;
}

export function VaultProfileCardSkeleton({
  name,
  address,
  buttonText = "Delegate",
}: VaultProfileCardSkeletonProps): ReactElement {
  return (
    <VaultProfileCard
      address={address}
      name={name}
      stats={[
        {
          label: <Skeleton />,
          value: <Skeleton />,
        },
        {
          label: <Skeleton />,
          value: <Skeleton />,
        },
        {
          label: <Skeleton />,
          value: <Skeleton />,
        },
        {
          label: <Skeleton />,
          value: <Skeleton />,
        },
      ]}
      button={{
        text: buttonText,
        disabled: true,
        onClick: () => null,
      }}
    />
  );
}
