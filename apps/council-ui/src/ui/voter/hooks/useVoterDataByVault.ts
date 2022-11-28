import { LockingVault, VestingVault, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

interface VoterDataByVault {
  name: string;
  votingPower: string;
  balance?: string;
  numDelegated?: number;
  currentDelegate?: Voter;
}

export function useVoterDataByVault(
  address: string | undefined,
): UseQueryResult<VoterDataByVault[]> {
  const { coreVoting } = useCouncil();

  return useQuery<VoterDataByVault[]>(["voter-data-by-vault"], async () => {
    const _address = address as string;

    return Promise.all(
      coreVoting.vaults.map(async (vault) => {
        const name = vault.name;
        const votingPower = await vault.getVotingPower(_address);

        if (vault instanceof LockingVault) {
          const balance = await vault.getDepositedBalance(_address);
          const numDelegated = (await vault.getDelegatorsTo(_address)).length;
          const currentDelegate = await vault.getDelegate(_address);

          return {
            name,
            votingPower,
            balance,
            numDelegated,
            currentDelegate,
          };
        }

        if (vault instanceof VestingVault) {
          const balance = await (await vault.getGrant(_address)).votingPower;
          const numDelegated = (await vault.getDelegatorsTo(_address)).length;
          const currentDelegate = await vault.getDelegate(_address);

          return {
            name,
            votingPower,
            balance,
            numDelegated,
            currentDelegate,
          };
        }

        return {
          name,
          votingPower,
        };
      }),
    );
  });
}
