import { getBlockDate, Proposal, VotingContract } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useCouncil } from "src/ui/council/useCouncil";
import QuorumBar from "src/ui/QuorumBar";
import { useProvider } from "wagmi";

function useProposal(
  proposalId: number,
  votingContract: VotingContract | string,
) {
  const { context } = useCouncil();
  return useQuery(
    [votingContract, proposalId],
    async () => {
      return new Proposal(proposalId, votingContract, context);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

interface ProposalQuorum {
  currentQuorum?: string | null;
  requiredQuorum?: string | null;
}

function useProposalQuorum(proposal?: Proposal) {
  return useQuery<ProposalQuorum>(
    [proposal],
    async () => {
      const currentQuorum = await proposal!.getCurrentQuorum();
      const requiredQuorum = await proposal!.getRequiredQuorum();
      return {
        currentQuorum,
        requiredQuorum,
      };
    },
    {
      enabled: !!proposal,
    },
  );
}

function useProposalStats(proposal?: Proposal) {
  const provider = useProvider();
  return useQuery(
    [proposal, !!proposal],
    async () => {
      const createdAt = await getBlockDate(
        await +proposal!.getCreatedBlock(),
        provider,
      );

      const endsAt = await getBlockDate(
        await +proposal!.getExpirationBlock(),
        provider,
      );

      const unlockedAt = await getBlockDate(
        await +proposal!.getUnlockBlock(),
        provider,
      );

      const lastCallAt = await getBlockDate(
        await +proposal!.getLastCallBlock(),
        provider,
      );

      return {
        createdAt,
        endsAt,
        unlockedAt,
        lastCallAt,
      };
    },
    {
      enabled: !!proposal,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  );
}

export default function ProposalPage(): ReactElement {
  const {
    query: { coreVotingAddressParam, idParam },
  } = useRouter();

  const proposalId = +(idParam as string);
  const coreVotingAddress = coreVotingAddressParam as string;

  const { data: proposal } = useProposal(proposalId, coreVotingAddress);

  //console.log(proposal, !!proposal);
  const { data: proposalQuorum } = useProposalQuorum(proposal);
  //console.log(proposalQuorum);

  const { data: stats } = useProposalStats(proposal);

  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      {/* Page Header */}
      <div className="flex w-full flex-wrap items-center gap-4">
        <h1 className="mb-4 whitespace-nowrap text-5xl text-accent-content underline">
          Proposal {proposalId}
        </h1>

        {proposalQuorum?.currentQuorum && proposalQuorum?.requiredQuorum && (
          <div className="sm:ml-auto">
            <QuorumBar
              current={proposalQuorum.currentQuorum}
              required={proposalQuorum.requiredQuorum}
            />
          </div>
        )}
      </div>

      {/* Statistics Row */}
      <div className="flex flex-wrap gap-4">
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Voting Contract</div>
            <div className="daisy-stat-value text-sm">Core Voting</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Created</div>
            <div className="daisy-stat-value text-sm">
              {stats?.createdAt?.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="daisy-stat-value text-sm">
              {stats?.endsAt?.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="daisy-stat-value text-sm">
              {stats?.unlockedAt?.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Last Call</div>
            <div className="daisy-stat-value text-sm">
              {stats?.lastCallAt?.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-10 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          <h1 className="text-2xl text-accent-content">Voting Activity</h1>
          <div className="grid grid-cols-3">
            <h2>Voter</h2>
            <h2>Voting Power</h2>
            <h2>Ballot</h2>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="daisy-input-bordered daisy-input-accent daisy-input bg-base-300"
          />

          {/* Data Rows */}
          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl text-accent-content">Your Vote</h2>
            <div className="flex">
              <h3>Vaults</h3>
              <h3 className="ml-auto">Voting Power</h3>
            </div>
            <div className="flex max-h-64 flex-col gap-y-3 overflow-y-auto pr-8">
              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>
            </div>

            <div className="flex">
              <h2 className="text-lg text-secondary-content">
                Total Voting Power
              </h2>
              <h2 className="ml-auto text-lg font-bold text-accent-content">
                200,000
              </h2>
            </div>

            <div className="daisy-btn-group m-auto">
              <button className="daisy-btn daisy-btn-active daisy-btn-lg">
                YES
              </button>
              <button className="daisy-btn daisy-btn-lg">NO</button>
              <button className="daisy-btn daisy-btn-lg">ABSTAIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
