import { LockingVault, VestingVault, Voter, VotingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

export interface VoterDataByVault {
  vault: VotingVault;
  votingPower: string;
  balance?: string;
  numDelegated?: number;
  currentDelegate?: Voter;
}

export function useVoterDataByVault(
  address: string | undefined,
): UseQueryResult<VoterDataByVault[]> {
  const { coreVoting } = useCouncil();

  return useQuery<VoterDataByVault[]>({
    queryKey: ["voter-data-by-vault", address],
    enabled: !!address,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      // this will never happen because of the enabled flag
      if (!address) {
        return Promise.resolve([]);
      }

      return Promise.all(
        coreVoting.vaults.map(async (vault) => {
          const name = vault.name;
          const votingPower = await vault.getVotingPower(address);

          if (vault instanceof LockingVault) {
            const balance = await vault.getDepositedBalance(address);
            const numDelegated = (await vault.getDelegatorsTo(address)).length;
            const currentDelegate = await vault.getDelegate(address);

            return {
              vault,
              votingPower,
              balance,
              numDelegated,
              currentDelegate,
            };
          }

          if (vault instanceof VestingVault) {
            const balance = await (await vault.getGrant(address)).votingPower;
            const numDelegated = (await vault.getDelegatorsTo(address)).length;
            const currentDelegate = await vault.getDelegate(address);

            return {
              vault,
              votingPower,
              balance,
              numDelegated,
              currentDelegate,
            };
          }

          return {
            vault,
            name,
            votingPower,
          };
        }),
      );
    },
  });
}
