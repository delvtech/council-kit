import { ProposalStatus } from "@delvtech/council-js";
import { Address, Hash } from "@delvtech/drift";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import { makeEtherscanTransactionURL } from "src/utils/etherscan/makeEtherscanTransactionURL";

interface ProposalStatsRowProps {
  votingContractName?: string;
  votingContractAddress: Address;
  createdBy: Address | undefined;
  createdTransactionHash: Hash | undefined;
  endsAtDate: Date | undefined;
  unlockAtDate: Date | undefined;
  lastCallAtDate: Date | undefined;
  executedTransactionHash: Hash | undefined;
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
  const chainId = useSupportedChainId();
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

      {endsAtDate && status !== "executed" && (
        <Stat
          label={status === "active" ? "Voting ends" : "Voting ended on"}
          value={endsAtDate.toLocaleDateString()}
        />
      )}

      {unlockAtDate && status === "active" && (
        <Stat label="Executable on" value={unlockAtDate.toLocaleDateString()} />
      )}

      {lastCallAtDate && status !== "executed" && (
        <Stat
          label={status === "active" ? "Execution deadline" : "Expired on"}
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
