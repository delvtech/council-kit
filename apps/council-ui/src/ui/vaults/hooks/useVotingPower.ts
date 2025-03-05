import { Address, RangeBlock } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { VotingContractConfig } from "src/config/types";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

interface UseVotingPowerOptions {
  votingContract: VotingContractConfig;
  account: Address | undefined;
  block?: RangeBlock;
  chainId?: SupportedChainId;
}

/**
 * Get the voting power of an account in all vaults configured for a voting
 * contract.
 */
export default function useVotingPower({
  chainId,
  votingContract,
  account,
  block,
}: UseVotingPowerOptions) {
  chainId = useSupportedChainId(chainId);
  const council = useReadCouncil({ chainId });
  const enabled = !!account && !!chainId && !!council;
  return useQuery({
    queryKey: ["votingPower", chainId, votingContract.address, account, block],
    enabled,
    queryFn: enabled
      ? async () => {
          let totalVotingPower = 0n;
          const vaultPowers = await Promise.all(
            votingContract.vaults.map(async (vault) => {
              const votingPower = await council
                .votingVault(vault.address)
                .getVotingPower({
                  voter: account,
                  block,
                });
              totalVotingPower += votingPower;

              return {
                vaultName: vault.name,
                vaultAddress: vault.address,
                votingPower,
              };
            }),
          );

          return {
            vaultPowers,
            totalVotingPower,
          };
        }
      : undefined,
  });
}
