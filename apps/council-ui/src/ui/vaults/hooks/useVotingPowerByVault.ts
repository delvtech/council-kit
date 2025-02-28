import { Address, RangeBlock } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { AnyVotingContractConfig } from "src/config/utils/getVotingContractConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/hooks/useReadCouncil";

interface UseVotingPowerByVaultOptions {
  votingContract: AnyVotingContractConfig;
  account: Address | undefined;
  block?: RangeBlock;
  chainId?: SupportedChainId;
}

/**
 * Get the voting power of an account in all vaults configured for a voting
 * contract.
 */
export default function useVotingPowerByVault({
  votingContract,
  account,
  block,
  chainId,
}: UseVotingPowerByVaultOptions) {
  chainId = useSupportedChainId(chainId);
  const council = useReadCouncil();
  const enabled = !!account && !!chainId;

  return useQuery({
    queryKey: ["votingPowerByVault", account, chainId, Number(block)],
    enabled,
    queryFn: enabled
      ? async () => {
          return Promise.all(
            votingContract.vaults.map(async (vault) => {
              const readVault = council.votingVault(vault.address);
              const votingPower = await readVault.getVotingPower({
                voter: account,
                block,
              });

              return {
                vaultName: vault.name,
                vaultAddress: vault.address,
                votingPower,
              };
            }),
          );
        }
      : undefined,
  });
}
