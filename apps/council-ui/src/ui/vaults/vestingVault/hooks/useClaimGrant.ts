import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

export function useClaimGrant(): {
  claimGrant: ((vaultAddress: `0x${string}`) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const council = useReadWriteCouncil();
  const enabled = !!council;

  const { write, status, transactionHash } = useWrite({
    writeFn: (vaultAddress: `0x${string}`) => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      return council.vestingVault(vaultAddress).claim();
    },
  });

  return {
    claimGrant: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
