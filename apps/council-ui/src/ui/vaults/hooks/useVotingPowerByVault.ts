import { BlockLike, ReadVotingVault } from "@delvtech/council-core";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

interface UseVotingPowerByVaultOptions {
  vaults: (ReadVotingVault | `0x${string}`)[];
  account?: `0x${string}`;
  atBlock?: BlockLike;
}

/**
 * Get the voting power of a wallet in all configured vaults.
 * @param account The account to get voting power for. If not provided, the
 * connected account will be used.
 */
export default function useVotingPowerByVault({
  vaults: _vaults,
  account,
  atBlock,
}: UseVotingPowerByVaultOptions): {
  votingPowerByVault:
    | {
        name: string;
        address: `0x${string}`;
        votingPower: bigint;
        votingPowerFormatted: string;
      }[]
    | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const config = useCouncilConfig();

  const vaults = _vaults.map((vault) =>
    typeof vault === "string" ? council.votingVault(vault) : vault,
  );

  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;

  const enabled = !!accountToUse;

  const { data, status } = useQuery({
    queryKey: ["votingPowerByVault", account, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          return Promise.all(
            vaults.map(async (vault) => {
              let name = vault.name;

              if (vault.address === config.gscVoting?.vault.address) {
                name = config.gscVoting?.vault.name;
              }

              const vaultConfig = config.coreVoting.vaults.find(
                ({ address }) => address === vault.address,
              );

              if (vaultConfig) {
                name = vaultConfig.name;
              }

              const votingPower = await vault.getVotingPower({
                account: accountToUse,
                atBlock,
              });

              return {
                name,
                address: vault.address,
                votingPower,
                /**
                 * All voting power is formatted as a string with 18 decimal places.
                 */
                votingPowerFormatted: formatEther(votingPower),
              };
            }),
          );
        }
      : undefined,
  });

  return {
    votingPowerByVault: data,
    status,
  };
}
