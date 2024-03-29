import { Ballot, ReadVotingVault } from "@delvtech/council-viem";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { useReadProposal } from "src/ui/proposals/hooks/useReadProposal";
import useVotingPowerByVault from "src/ui/vaults/hooks/useVotingPowerByVault";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { useSubmitVote } from "src/ui/voting/hooks/useSubmitVote";
import { useVote } from "src/ui/voting/hooks/useVote";
import { useAccount } from "wagmi";

interface ProposalVotingProps {
  coreVotingAddress: `0x${string}`;
  proposalId: bigint;
  vaults: (ReadVotingVault | `0x${string}`)[];
}

export function ProposalVoting({
  coreVotingAddress,
  proposalId,
  vaults,
}: ProposalVotingProps): ReactElement {
  const isConnected = useAccount().isConnected;
  const { proposal } = useReadProposal({
    id: proposalId,
    coreVoting: coreVotingAddress,
  });

  const { votingPowerByVault, status, fetchStatus } = useVotingPowerByVault({
    vaults,
    atBlock: proposal?.created,
  });
  const totalVotingPower = votingPowerByVault?.reduce(
    (total, vault) => total + vault.votingPower,
    0n,
  );

  const { vote } = useVote({
    proposalId,
    coreVotingAddress,
  });
  const { submitVote, status: submitVoteStatus } = useSubmitVote();

  function handleVote(ballot: Ballot) {
    submitVote?.({
      proposalId,
      coreVotingAddress,
      ballot,
      vaults,
    });
  }

  const disabled =
    !isConnected || !submitVote || submitVoteStatus === "pending";

  return fetchStatus === "fetching" ? (
    <ProposalVotingSkeleton />
  ) : (
    <div className="flex flex-col gap-y-4">
      <div className="flex">
        <h3 className="text-lg font-medium">Vaults</h3>
        <h3 className="ml-auto text-lg font-medium">Voting Power</h3>
      </div>
      <div className="flex max-h-64 flex-col gap-y-4 overflow-y-auto">
        {votingPowerByVault?.map((vault) => (
          <div className="flex" key={vault.name}>
            <Link
              href={makeVaultURL(vault.address)}
              className="hover:underline"
            >
              <h3>{vault.name}</h3>
            </Link>
            <p className="ml-auto">{formatVotingPower(vault.votingPower)}</p>
          </div>
        ))}
      </div>

      <div className="flex">
        <h2 className="text-lg">Total Voting Power</h2>
        <p className="ml-auto text-lg font-bold">
          {formatVotingPower(totalVotingPower ?? 0)}
        </p>
      </div>

      <div className="daisy-join m-auto flex w-full">
        <button
          className={classNames(
            "daisy-btn daisy-join-item daisy-btn-lg flex-1",
            {
              "daisy-btn-active": vote?.ballot === "yes",
            },
          )}
          onClick={() => handleVote("yes")}
          disabled={disabled}
        >
          YES
        </button>
        <button
          className={classNames(
            "daisy-btn daisy-join-item daisy-btn-lg flex-1",
            {
              "daisy-btn-active": vote?.ballot === "no",
            },
          )}
          onClick={() => handleVote("no")}
          disabled={disabled}
        >
          NO
        </button>
        <button
          className={classNames(
            "daisy-btn daisy-join-item daisy-btn-lg flex-1",
            {
              "daisy-btn-active": vote?.ballot === "maybe",
            },
          )}
          onClick={() => handleVote("maybe")}
          disabled={disabled}
        >
          ABSTAIN
        </button>
      </div>
    </div>
  );
}
