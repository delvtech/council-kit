import classNames from "classnames";
import Link from "next/link";
import { ReactElement } from "react";
import { makeEtherscanTransactionURL } from "src/etherscan/makeEtherscanTransactionURL";
import { ProposalStatus } from "src/proposals/getProposalStatus";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Stat } from "src/ui/base/Stat";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useChainId } from "src/ui/network/useChainId";
import { VoterAddress } from "src/ui/voters/VoterAddress";

interface ProposalStatsRowProps {
  votingContractName: string;
  votingContractAddress: string;
  createdBy: string | null;
  createdTransactionHash: string | null;
  endsAtDate: Date | null;
  unlockAtDate: Date | null;
  lastCallAtDate: Date | null;
  executedTransactionHash: string | null;
  status: ProposalStatus;
  className?: string;
}

export function ProposalStatsRow({
  votingContractAddress,
  votingContractName,
  createdBy,
  createdTransactionHash,
  endsAtDate,
  unlockAtDate,
  lastCallAtDate,
  executedTransactionHash,
  status,
  className,
}: ProposalStatsRowProps): ReactElement {
  const createdByDisplayName = useDisplayName(createdBy);
  const chainId = useChainId();
  return (
    <div className={classNames("flex flex-wrap gap-4", className)}>
      <Stat
        label="Voting contract"
        value={
          <AddressWithEtherscan
            address={votingContractAddress}
            label={votingContractName}
          />
        }
      />

      {createdByDisplayName && createdBy && (
        <Stat
          label={
            <DefinitionTooltip content="The creator of the on-chain proposal, which may or may not be the original author.">
              Put on chain by
            </DefinitionTooltip>
          }
          value={
            <Link
              className="flex items-center hover:underline"
              href={makeVoterURL(createdBy)}
            >
              <VoterAddress
                iconSize={16}
                address={createdBy}
                ensName={createdByDisplayName}
              />
            </Link>
          }
        />
      )}
      {createdTransactionHash && (
        <Stat
          label="Created transaction"
          value={
            <Link
              className="flex items-center hover:underline"
              href={makeEtherscanTransactionURL(
                createdTransactionHash,
                chainId,
              )}
            >
              {formatAddress(createdTransactionHash)}
              <ExternalLinkSVG />
            </Link>
          }
        />
      )}

      {endsAtDate && status !== "EXECUTED" && (
        <Stat
          label={status === "IN PROGRESS" ? "Voting ends" : "Voting ended on"}
          value={endsAtDate.toLocaleDateString()}
        />
      )}

      {unlockAtDate && status === "IN PROGRESS" && (
        <Stat label="Executable on" value={unlockAtDate.toLocaleDateString()} />
      )}

      {lastCallAtDate && status !== "EXECUTED" && (
        <Stat
          label={status === "IN PROGRESS" ? "Execution deadline" : "Expired on"}
          value={lastCallAtDate.toLocaleDateString()}
        />
      )}

      {executedTransactionHash && (
        <Stat
          label="Executed transaction"
          value={
            <Link
              className="flex items-center hover:underline"
              href={makeEtherscanTransactionURL(
                executedTransactionHash,
                chainId,
              )}
            >
              {formatAddress(executedTransactionHash)}
              <ExternalLinkSVG />
            </Link>
          }
        />
      )}
    </div>
  );
}
