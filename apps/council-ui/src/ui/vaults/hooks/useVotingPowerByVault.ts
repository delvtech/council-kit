import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

interface VotingPowerByVault {
  name: string;
  address: string;
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
    queryFn: async (): Promise<VotingPowerByVault[]> => {
      return Promise.all(
        coreVoting.vaults.map(async (vault) => {
          return {
            name: vault.name,
            address: vault.address,
            // safe to cast because this function only is ran when string is non-nullable
            votingPower: await vault.getVotingPower(account as string, atBlock),
          };
        }),
      );
    },
  });
}
