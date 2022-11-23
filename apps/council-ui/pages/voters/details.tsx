import { Vote, Voter } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import assertNever from "assert-never";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";
import { useFormattedGSCStatus } from "src/ui/voter/hooks/useFormattedGSCStatus";
import { VotingHistoryList } from "src/ui/voter/VotingHistoryList";
import { useEnsName } from "wagmi";

export default function VoterDetailsPage(): ReactElement {
  const { query } = useRouter();
  const { address } = query as { address: string | undefined };

  const { data: voterData, status, error } = useVoterData(address);
  const _address = getAddress(address as string);
  const { data: ens } = useEnsName({ address: _address });

  return (
    <Page>
      <div>
        {ens ? (
          <>
            <h1 className="w-full text-5xl text-accent-content">{ens}</h1>
            {address && (
              <h2 className="mt-2 w-full text-2xl underline">
                {formatAddress(address)}
              </h2>
            )}
          </>
        ) : (
          <>
            {address && (
              <h2 className="mt-2 w-full text-5xl text-accent-content underline">
                {formatAddress(address)}
              </h2>
            )}
          </>
        )}
      </div>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="flex flex-col items-center gap-8 ">
                <p>Loading voter data. This might take a while...</p>
                <Progress />
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
              <>
                <VoterStatisticsRow
                  voterAddress={voterData.voter.address}
                  votingPower={voterData.votingPower}
                  proposalsVoted={voterData.proposalsVoted}
                />

                <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
                  <div className="flex min-w-[500px] flex-col gap-y-4 sm:basis-[65%]">
                    <h2 className="text-2xl font-bold">Voting History</h2>
                    <VotingHistoryList history={voterData.votingHistory} />
                  </div>

                  <div className="flex flex-col gap-y-4 sm:basis-[35%]">
                    <div className="text-2xl font-bold">Voting Vault (6)</div>
                    <VotingPowerByVaultList
                      vaultData={voterData.voterDataByVault}
                    />
                  </div>
                </div>
              </>
            );
          default:
            assertNever(status);
        }
      })()}
    </Page>
  );
}

interface VoterDataByVault {
  name: string;
  votingPower: string;
}

interface VoterData {
  isGSC: boolean | undefined;
  proposalsVoted: number;
  voter: Voter;
  voterDataByVault: VoterDataByVault[];
  votingHistory: Vote[];
  votingPower: string;
}

function useVoterData(address: string | undefined) {
  const { coreVoting, context, gscVoting } = useCouncil();

  return useQuery<VoterData>(
    ["voter", address],
    async () => {
      const voter = new Voter(address as string, context);

      const votingHistory = await voter.getVotes(coreVoting.address);
      const proposalsVoted = votingHistory.length;
      const votingPower = await voter.getVotingPower(
        coreVoting.vaults.map((vault) => vault.address),
      );

      const voterDataByVault = await Promise.all(
        coreVoting.vaults.map(async (vault) => {
          const name = vault.name;
          const votingPower = await vault.getVotingPower(address as string);
          // TODO @cashd: fetch current delegation and num wallets delegated data
          return {
            name,
            votingPower,
          };
        }),
      );

      const isGSC = await gscVoting?.getIsMember(address as string);

      return {
        voter,
        votingHistory,
        votingPower,
        proposalsVoted,
        isGSC,
        voterDataByVault,
      };
    },
    {
      enabled: !!address,
    },
  );
}

interface VoterStatisticsRowProps {
  voterAddress: string;
  votingPower: string;
  proposalsVoted: number;
}

function VoterStatisticsRow({
  voterAddress,
  votingPower,
  proposalsVoted,
}: VoterStatisticsRowProps): ReactElement {
  const { data: gscStatus } = useFormattedGSCStatus(voterAddress);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Power</div>
          <div className="daisy-stat-value text-sm">
            {formatBalance(votingPower, 0)}
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">GSC Member</div>
          <div className="daisy-stat-value text-sm">{gscStatus}</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Proposals voted</div>
          <div className="daisy-stat-value text-sm">{proposalsVoted}</div>
        </div>
      </div>
    </div>
  );
}

interface VotingPowerByVaultProps {
  vaultData: VoterDataByVault[];
}

function VotingPowerByVaultList({
  vaultData,
}: VotingPowerByVaultProps): ReactElement {
  return (
    <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
      {vaultData.map((vault) => {
        return (
          <div className="flex flex-col gap-y-2" key={vault.name}>
            <h3 className="text-xl font-bold underline">{vault.name}</h3>

            <div className="flex">
              <p>Voting Power</p>
              <p className="ml-auto">{formatBalance(vault.votingPower)} ELFI</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
