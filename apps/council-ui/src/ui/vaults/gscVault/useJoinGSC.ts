import { CouncilContext, GSCVault, VotingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { VaultConfig } from "src/config/CouncilConfig";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { getCoreVotingVaults } from "src/vaults/vaults";

interface JoinGSCOptions {
  signer: Signer;
}
export function useJoinGSC(
  gscVaultAddress: string,
): UseMutationResult<string, unknown, JoinGSCOptions> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  const chainId = useChainId();
  let transactionHash: string;
  const coreVotingVaultConfigs = getCoreVotingVaults(chainId);

  return useMutation({
    mutationFn: async ({ signer }: JoinGSCOptions): Promise<string> => {
      const signerAddress = await signer.getAddress();
      // collect the vaults that the signer has voting power in. We can only use
      // those vaults when calling GSCVault.join
      const vaultsWithVotingPowerForSigner =
        await getVaultsWithVotingPowerForAccount(
          signerAddress,
          coreVotingVaultConfigs,
          context,
        );

      const gscVault = new GSCVault(gscVaultAddress, context);
      return gscVault.join(signer, vaultsWithVotingPowerForSigner, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast(
            "Transaction submitted to join the GSC...",
            hash,
            chainId,
          );
          transactionHash = hash;
        },
      });
    },
    onSuccess: (hash) => {
      makeTransactionSuccessToast("Successfully joined the GSC!", hash);
      queryClient.invalidateQueries();
    },
    onError(error) {
      makeTransactionErrorToast(
        "Failed to join the GSC. Please make sure you have the requisite voting power to become a member first.",
        transactionHash,
        chainId,
      );
      console.error(error);
    },
  });
}

// TODO: Use getVaultsWithPower from SDK
async function getVaultsWithVotingPowerForAccount(
  account: string,
  coreVotingVaults: VaultConfig[],
  context: CouncilContext,
) {
  return (
    await Promise.all(
      coreVotingVaults.map(async ({ address }) => {
        const vault = new VotingVault(address, context);
        return {
          vaultAddress: vault.address,
          votingPower: await vault.getVotingPower(account),
        };
      }),
    )
  )
    .filter(({ votingPower }) => +votingPower > 0)
    .map(({ vaultAddress }) => vaultAddress);
}
