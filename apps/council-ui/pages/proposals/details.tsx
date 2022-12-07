import { Ballot, getBlockDate, Proposal, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import assertNever from "assert-never";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import QuorumBar from "src/ui/components/QuorumBar/QuorumBar";
import { useCouncil } from "src/ui/council/useCouncil";
import { useGSCVote } from "src/ui/voting/hooks/useGSCVote";
import { useVote } from "src/ui/voting/hooks/useVote";
import ProposalVoting from "src/ui/voting/ProposalVoting";
import { useAccount, useBlockNumber, useSigner } from "wagmi";

export default function ProposalPage(): ReactElement {
  const { query } = useRouter();
  const id = +(query.id as string);
  const votingContractAddress = query.votingContract as string;

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data, status, error } = useProposalDetailsPageData(
    votingContractAddress,
    id,
    address,
  );
  const { mutate: vote } = useVote();
  const { mutate: gscVote } = useGSCVote();
  const { data: blockNumber } = useBlockNumber();

  // TODO:
  // if (!id || !votingContractAddress) {
  //   replace("/404");
  // }

  function handleVote(ballot: Ballot) {
    if (!data || !signer) {
      return;
    }
    const variables = {
      signer,
      proposalId: id,
      ballot,
    };
    if (data.type === "gsc") {
      return gscVote(variables);
    }
    return vote(variables);
  }

  switch (status) {
    case "loading":
      return (
        <div className="w-48 m-auto mt-48 px-8">
          <progress className="daisy-progress">
            Loading proposal details. Hang on a sec...
          </progress>
        </div>
      );

    case "error":
      return (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      );

    case "success":
      return (
        <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
          <div className="flex w-full flex-wrap items-center gap-4">
            <h1 className="mb-4 whitespace-nowrap text-5xl text-accent-content">
              {data.name ?? `Proposal ${id}`}
            </h1>
            ) : (
            <h1 className="text-center whitespace-nowrap text-5xl text-accent-content">
              Unknown Proposal
            </h1>
            {data.requiredQuorum && (
              <div className="sm:ml-auto">
                <QuorumBar
                  current={data.currentQuorum}
                  required={data.requiredQuorum}
                />
              </div>
            )}
          </div>

          <ProposalStatsBar
            createdAtDate={data.createdAtDate}
            endsAtDate={data.endsAtDate}
            unlockedAtDate={data.unlockedAtDate}
            lastCallAtDate={data.lastCallAtDate}
          />

          <div className="flex w-full flex-wrap gap-10 sm:gap-y-0">
            <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
              <h1 className="text-2xl text-accent-content">Voting Activity</h1>
              <ProposalVotingActivity votes={data.votes} />
            </div>

            <div className="grow basis-[300px] md:grow-0">
              <ProposalVoting
                atBlock={data.createdAtBlock || blockNumber}
                account={address}
                accountBallot={data.accountBallot}
                disabled={!signer || !data.isActive}
                onVote={handleVote}
              />
            </div>
          </div>
        </div>
      );

    default:
      assertNever(status);
  }
}

interface ProposalDetailsPageData {
  type: "core" | "gsc";
  name: string;
  isActive: boolean;
  currentQuorum: string;
  requiredQuorum: string | null;
  createdAtBlock: number | null;
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
  votes: Vote[];
  accountBallot?: Ballot;
}

function useProposalDetailsPageData(
  votingContractAddress?: string,
  id?: number,
  account?: string,
) {
  const { context, coreVoting, gscVoting } = useCouncil();
  const provider = context.provider;

  return useQuery<ProposalDetailsPageData>({
    queryKey: ["proposalDetailsPage", id],
    enabled:
      votingContractAddress !== undefined &&
      id !== undefined &&
      account !== undefined,
    queryFn: async () => {
      // safe to cast since the fn is disabled if these aren't defined.
      votingContractAddress = votingContractAddress as string;
      id = id as number;
      account = account as string;

      let proposal: Proposal | undefined;
      let type: ProposalDetailsPageData["type"] = "core";

      if (votingContractAddress === coreVoting.address) {
        proposal = coreVoting.getProposal(id);
      } else if (votingContractAddress === gscVoting?.address) {
        type = "gsc";
        proposal = gscVoting.getProposal(id);
      } else {
        throw new Error(
          `No config found for voting contract address ${votingContractAddress}, See src/config.`,
        );
      }

      const createdAtBlock = await proposal.getCreatedBlock();
      const createdAtDate = createdAtBlock
        ? await getBlockDate(createdAtBlock, provider)
        : null;

      const endsAtBlock = await proposal.getExpirationBlock();
      const endsAtDate = endsAtBlock
        ? await getBlockDate(endsAtBlock, provider)
        : null;

      const unlockedAtBlock = await proposal.getUnlockBlock();
      const unlockedAtDate = unlockedAtBlock
        ? await getBlockDate(unlockedAtBlock, provider)
        : null;

      const lastCallAtBlock = await proposal.getLastCallBlock();
      const lastCallAtDate = lastCallAtBlock
        ? await getBlockDate(lastCallAtBlock, provider)
        : null;

      return {
        type,
        name: proposal.name,
        isActive: await proposal.getIsActive(),
        currentQuorum: await proposal.getCurrentQuorum(),
        requiredQuorum: await proposal.getRequiredQuorum(),
        createdAtBlock,
        createdAtDate,
        endsAtDate,
        unlockedAtDate,
        lastCallAtDate,
        votes: await proposal.getVotes(),
        accountBallot: (await proposal.getVote(account))?.ballot,
      };
    },
  });
}

interface ProposalStatsBarProps {
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
}

function ProposalStatsBar({
  createdAtDate,
  endsAtDate,
  unlockedAtDate,
  lastCallAtDate,
}: ProposalStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Contract</div>
          <div className="daisy-stat-value text-sm">Core Voting</div>
        </div>
      </div>

      {createdAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Created</div>
            <div className="daisy-stat-value text-sm">
              {createdAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {endsAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="daisy-stat-value text-sm">
              {endsAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {unlockedAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="daisy-stat-value text-sm">
              {unlockedAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {lastCallAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Last Call</div>
            <div className="daisy-stat-value text-sm">
              {lastCallAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProposalVotingActivityProps {
  votes: Vote[] | null;
}

interface ProposalVotingActivityRowProps {
  address: string;
  votePower: string;
  voteBallot: Ballot;
}

// TODO @cashd: this component will need to be refactored to optimize for
//   ens fetching and searching higher up in the tree
function ProposalVotingActivityRow({
  address,
  votePower,
  voteBallot,
}: ProposalVotingActivityRowProps) {
  const displayName = useDisplayName(address);

  return (
    <div className="grid grid-cols-3 p-2">
      <h2 className="underline">
        {displayName}
        <a
          href={makeEtherscanAddressURL(address)}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLinkSVG />
        </a>
      </h2>
      <h2>{formatBalance(votePower)}</h2>

      {(() => {
        switch (voteBallot) {
          case "yes":
            return (
              <h2 className="text-green-400 font-semibold">
                {voteBallot.toUpperCase()}
              </h2>
            );

          case "no":
            return (
              <h2 className="text-red-400 font-semibold">
                {voteBallot.toUpperCase()}
              </h2>
            );

          case "maybe":
            return <h2>{voteBallot.toUpperCase()}</h2>;
        }
      })()}
    </div>
  );
}

function ProposalVotingActivity({
  votes,
}: ProposalVotingActivityProps): ReactElement {
  return (
    <>
      <div className="grid grid-cols-3">
        <h2 className="text-xl">Voter</h2>
        <h2 className="text-xl">Voting Power</h2>
        <h2 className="text-xl">Ballot</h2>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="daisy-input-bordered daisy-input"
      />
      <div className="overflow-y-auto h-72">
        {votes?.map((vote, i) => (
          <ProposalVotingActivityRow
            key={`${vote.voter.address}-${vote.ballot}-${i}`}
            address={vote.voter.address}
            votePower={vote.power}
            voteBallot={vote.ballot}
          />
        ))}
      </div>
    </>
  );
}
