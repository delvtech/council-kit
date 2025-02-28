import { Ballot } from "@delvtech/council-js";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement } from "react";
import { ExtendedVotingContractConfig } from "src/config/utils/getVotingContractConfig";
import { makeVaultURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import useProposal from "src/ui/proposals/hooks/useProposal";
import useVotingPower from "src/ui/vaults/hooks/useVotingPower";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { useSubmitVote } from "src/ui/voting/hooks/useSubmitVote";
import { useVote } from "src/ui/voting/hooks/useVote";
import { useAccount } from "wagmi";

interface ProposalVotingProps {
  votingContract: ExtendedVotingContractConfig;
  proposalId: bigint;
}

export function ProposalVoting({
  votingContract,
  proposalId,
}: ProposalVotingProps): ReactElement {
  const account = useAccount();

  const { data: proposal, status: proposalStatus } = useProposal({
    chainId: votingContract.chainId,
    votingContract: votingContract.address,
    proposalId,
  });

  const {
    data: votingPower,
    status,
    fetchStatus,
  } = useVotingPower({
    chainId: votingContract.chainId,
    votingContract,
    account: account?.address,
    block: proposal?.createdBlock,
  });

  const { data: vote } = useVote({
    chainId: votingContract.chainId,
    votingContract: votingContract.address,
    proposalId,
    account: account?.address,
  });

  const { write: submitVote, status: submitVoteStatus } = useSubmitVote({
    proposalId,
    votingContract: votingContract.address,
    vaults: votingContract.vaults.map((vault) => vault.address) ?? [],
    chainId: votingContract.chainId,
  });

  function handleVote(ballot: Ballot) {
    submitVote?.(ballot);
  }

  const disabled = !submitVote || submitVoteStatus === "pending";

  return fetchStatus === "fetching" ? (
    <ProposalVotingSkeleton />
  ) : (
    <div className="flex flex-col gap-y-4">
      <div className="flex">
        <h3 className="text-lg font-medium">Vaults</h3>
        <h3 className="ml-auto text-lg font-medium">Voting Power</h3>
      </div>
      <div className="flex max-h-64 flex-col gap-y-4 overflow-y-auto">
        {votingPower?.vaultPowers.map(
          ({ vaultAddress, votingPower, vaultName }) => (
            <div className="flex" key={vaultName}>
              <Link
                href={makeVaultURL(vaultAddress)}
                className="hover:underline"
              >
                <h3>{vaultName}</h3>
              </Link>
              <p className="ml-auto">{formatVotingPower(votingPower)}</p>
            </div>
          ),
        )}
      </div>

      <div className="flex">
        <h2 className="text-lg">Total Voting Power</h2>
        <p className="ml-auto text-lg font-bold">
          {formatVotingPower(votingPower?.totalVotingPower ?? 0)}
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
