import { MutationStatus } from "@tanstack/react-query";
import { useReadWriteAirdrop } from "src/ui/airdrop/hooks/useReadWriteAirdrop";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useAirdropData } from "./useAirdropData";
import { useClaimableAirdropAmount } from "./useClaimableAirdropAmount";

interface ClaimOptions {
  recipient: `0x${string}`;
}

export function useClaimAirdrop(): {
  claimAirdrop: ((options: ClaimOptions) => void) | undefined;
  transactionHash: `0x${string}` | undefined;
  status: MutationStatus;
} {
  const airdrop = useReadWriteAirdrop();
  const { airdropData } = useAirdropData();
  const { claimableAmount } = useClaimableAirdropAmount();

  const enabled = !!airdrop && !!claimableAmount && !!airdropData;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Claiming airdrop...",
    successMessage: "Airdrop claimed!",
    errorMessage: "Failed to claim airdrop.",
    writeFn: ({ recipient }: ClaimOptions) => {
      if (!enabled) {
        throw new Error("No claimable airdrop found");
      }

      return airdrop.claim({
        amount: claimableAmount,
        merkleProof: airdropData.proof,
        recipient,
        totalGrant: airdropData.amount,
      });
    },
  });

  return {
    claimAirdrop: enabled ? write : undefined,
    transactionHash,
    status,
  };
}
