import { getVaultsWithPower } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

interface VotingPowerByVault {
  name: string;
  votingPower: string;
}

export default function useVotingPowerByVault(
  account: string | undefined,
  atBlock?: number,
): UseQueryResult<VotingPowerByVault[], unknown> {
  const { coreVoting } = useCouncil();

  return useQuery<VotingPowerByVault[]>({
    queryKey: ["votingPowerByVault", account],
    enabled: !!account,
    queryFn: async () => {
      const vaults = await getVaultsWithPower(
        account as string,
        coreVoting.vaults,
      );

      return Promise.all(
        vaults.map(async (vault) => {
          return {
            name: vault.name,
            // safe to cast because this function only is ran when string is non-nullable
            votingPower: await vault.getVotingPower(account as string, atBlock),
          };
        }),
      );
    },
  });
}
