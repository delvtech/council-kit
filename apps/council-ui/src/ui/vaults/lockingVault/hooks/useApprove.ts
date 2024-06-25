import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";
import { maxUint256 } from "viem";
import { useAccount } from "wagmi";

export function useApprove(): {
  approve: ((vaultAddress: `0x${string}`) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const council = useReadWriteCouncil();
  const { address } = useAccount();
  const enabled = !!council && !!address;

  const { status, transactionHash, write } = useWrite({
    pendingMessage: "Approving...",
    successMessage: "Approved!",
    errorMessage: "Failed to approve.",
    writeFn: async (vaultAddress: `0x${string}`) => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      const token = await council.lockingVault(vaultAddress).getToken();
      return token.approve({
        amount: maxUint256,
        owner: address,
        spender: vaultAddress,
      });
    },
  });

  return {
    approve: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
