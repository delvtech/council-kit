import { MutationStatus } from "@tanstack/react-query";
import { useReadWriteAirdrop } from "src/ui/airdrop/hooks/useReadWriteAirdrop";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useAirdropData } from "./useAirdropData";
import { useClaimableAirdropAmount } from "./useClaimableAirdropAmount";

interface ClaimAndDelegateOptions {
  delegate: `0x${string}`;
  destination: `0x${string}`;
}

export function useClaimAndDelegateAirdrop(): {
  claimAndDelegateAirdrop:
    | ((options: ClaimAndDelegateOptions) => void)
    | undefined;
  transactionHash: `0x${string}` | undefined;
  status: MutationStatus;
} {
  const airdrop = useReadWriteAirdrop();
  const { data: airdropData } = useAirdropData();
  const { data: claimableAmount } = useClaimableAirdropAmount();

  const enabled = !!airdrop && !!claimableAmount && !!airdropData;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Claiming and delegating airdrop...",
    successMessage: "Airdrop claimed and delegated!",
    errorMessage: "Failed to claim and delegate airdrop.",
    writeFn: enabled
      ? ({ delegate, destination }: ClaimAndDelegateOptions) => {
          return airdrop.claimAndDelegate({
            args: {
              amount: claimableAmount,
              delegate,
              merkleProof: airdropData.proof,
              destination,
              totalGrant: airdropData.amount,
            },
          });
        }
      : undefined,
  });

  return {
    claimAndDelegateAirdrop: enabled ? write : undefined,
    transactionHash,
    status,
  };
}
