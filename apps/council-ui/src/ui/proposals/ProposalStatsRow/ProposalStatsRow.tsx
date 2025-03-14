import { ProposalStatus } from "@delvtech/council-js";
import { Address, Hash } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { useExecuteProposal } from "src/ui/proposals/hooks/useExecuteProposal";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import { makeEtherscanTransactionURL } from "src/utils/etherscan/makeEtherscanTransactionURL";

interface ProposalStatsRowProps {
  votingContractName?: string;
  votingContractAddress: Address;
  proposalId: bigint;
  createdBy: Address | undefined;
  createdTransactionHash: Hash | undefined;
  votingEndsBlock: bigint | undefined;
  unlockBlock: bigint | undefined;
  lastCallBlock: bigint | undefined;
  executedTransactionHash: Hash | undefined;
  status: ProposalStatus;
  className?: string;
}

export function ProposalStatsRow({
  votingContractAddress,
  votingContractName,
  proposalId,
  createdBy,
  createdTransactionHash,
  votingEndsBlock,
  unlockBlock,
  lastCallBlock,
  executedTransactionHash,
  status,
  className,
}: ProposalStatsRowProps): ReactElement {
  const createdByDisplayName = useDisplayName(createdBy);
  const chainId = useSupportedChainId();

  const { data: { lastCallDate, unlockDate, votingEndsDate } = {} } = useQuery({
    queryKey: [
      "ProposalStatsRow",
      String(votingEndsBlock),
      String(unlockBlock),
      String(lastCallBlock),
    ],
    queryFn: async () => {
      const [votingEndsDate, unlockDate, lastCallDate] = await Promise.all([
        getBlockDate(votingEndsBlock, chainId),
        getBlockDate(unlockBlock, chainId),
        getBlockDate(lastCallBlock, chainId),
      ]);
      return { votingEndsDate, unlockDate, lastCallDate };
    },
  });

  const { write: execute } = useExecuteProposal({
    votingContract: votingContractAddress,
    proposalId,
    chainId,
  });

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

      {votingEndsDate && status !== "executed" && (
        <Stat
          label={status === "active" ? "Voting ends" : "Voting ended on"}
          value={votingEndsDate.toLocaleDateString()}
        />
      )}

      {["unlocked", "closed"].includes(status) ? (
        <Stat
          value={
            <button
              type="button"
              className="daisy-btn daisy-btn-primary"
              disabled={!execute}
              onClick={execute}
            >
              Execute proposal
            </button>
          }
        />
      ) : (
        unlockDate &&
        status === "active" && (
          <Stat label="Executable on" value={unlockDate.toLocaleDateString()} />
        )
      )}

      {lastCallDate && !["unknown", "failed", "executed"].includes(status) && (
        <Stat
          label={status === "expired" ? "Expired on" : "Expires on"}
          value={lastCallDate.toLocaleDateString()}
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
