import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanTransactionURL } from "src/etherscan/makeEtherscanTransactionURL";
import { makeVoterURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Stat } from "src/ui/base/Stat";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface ProposalStatsBarProps {
  votingContractAddress: string;
  createdBy: string | null;
  createdTransactionHash: string | null;
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockAtDate: Date | null;
  lastCallAtDate: Date | null;
}

export function ProposalStatsBar({
  votingContractAddress,
  createdBy,
  createdAtDate,
  createdTransactionHash,
  endsAtDate,
  unlockAtDate,
  lastCallAtDate,
}: ProposalStatsBarProps): ReactElement {
  const createdByDisplayName = useDisplayName(createdBy);
  return (
    <div className="flex flex-wrap gap-4">
      <Stat
        label="Voting contract"
        value={<Address address={votingContractAddress} />}
      />

      {createdByDisplayName && createdBy && (
        <Stat
          label="Created by"
          value={
            <Link
              className="flex items-center hover:underline"
              href={makeVoterURL(createdBy)}
            >
              <WalletIcon address={createdBy} size={16} className="mr-1" />
              {createdByDisplayName}
            </Link>
          }
        />
      )}
      {createdTransactionHash && (
        <Stat
          label="Created Transaction Hash"
          value={
            <Link
              className="flex items-center hover:underline"
              href={makeEtherscanTransactionURL(createdTransactionHash)}
            >
              {formatAddress(createdTransactionHash)}
              <ExternalLinkSVG />
            </Link>
          }
        />
      )}

      {createdAtDate && (
        <Stat label="Created at" value={createdAtDate.toLocaleDateString()} />
      )}

      {unlockAtDate && (
        <Stat label="Executable on" value={unlockAtDate.toLocaleDateString()} />
      )}

      {endsAtDate && (
        <Stat label="Voting ends" value={endsAtDate.toLocaleDateString()} />
      )}

      {lastCallAtDate && (
        <Stat
          label="Execution deadline"
          value={lastCallAtDate.toLocaleDateString()}
        />
      )}
    </div>
  );
}

// ================ Skeletons ================

export function ProposalStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting contract" value={<Skeleton width={90} />} />
      <Stat label="Created by" value={<Skeleton width={90} />} />
      <Stat label="Created Transaction Hash" value={<Skeleton width={90} />} />
      <Stat label="Created at" value={<Skeleton width={90} />} />
      <Stat label="Executable on" value={<Skeleton width={90} />} />
      <Stat label="Voting ends" value={<Skeleton width={90} />} />
      <Stat label="Execution deadline" value={<Skeleton width={90} />} />
    </div>
  );
}
