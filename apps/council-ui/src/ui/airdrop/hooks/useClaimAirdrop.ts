import { MutationStatus } from "@tanstack/react-query";
import { useReadWriteAirdrop } from "src/ui/airdrop/hooks/useReadWriteAirdrop";
import { useWrite } from "src/ui/contract/useWrite";
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
  const { data: airdropData } = useAirdropData();
  const { data: claimableAmount } = useClaimableAirdropAmount();

  const enabled = !!airdrop && !!claimableAmount && !!airdropData;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Claiming airdrop...",
    successMessage: "Airdrop claimed!",
    errorMessage: "Failed to claim airdrop.",
    writeFn: enabled
      ? ({ recipient }: ClaimOptions) => {
          return airdrop.claim({
            args: {
              amount: claimableAmount,
              merkleProof: airdropData.proof,
              recipient,
              totalGrant: airdropData.amount,
            },
          });
        }
      : undefined,
  });

  return {
    claimAirdrop: enabled ? write : undefined,
    transactionHash,
    status,
  };
}
