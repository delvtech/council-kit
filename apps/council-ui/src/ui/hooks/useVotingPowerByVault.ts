import { useCouncil } from "src/ui/council/useCouncil";
import { useQuery } from "wagmi";
import { UseQueryResult } from "wagmi/dist/declarations/src/hooks/utils";

interface VotingPowerByVault {
  name: string;
  votingPower: string;
}

export default function useVotingPowerByVault(
  account?: string,
): UseQueryResult<VotingPowerByVault, unknown> {
  const { coreVoting } = useCouncil();

  return useQuery(
    ["votingPowerByVault"],
    async () => {
      const vaults = coreVoting.vaults;

      return await Promise.all(
        vaults.map(async (vault) => {
          return {
            name: vault.name,
            votingPower: await vault.getVotingPower(account!),
          } as VotingPowerByVault;
        }),
      );
    },
    {
      enabled: !!account,
    },
  );
}
