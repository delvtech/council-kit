import { getVaultsWithPower } from "@delvtech/council-core";
import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useAccount } from "wagmi";
import { useReadWriteGscVault } from "./useReadWriteGscVault";

export function useJoinGsc(): {
  joinGsc: (() => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const { address } = useAccount();
  const coreVoting = useReadCoreVoting();
  const gscVault = useReadWriteGscVault();
  const enabled = !!address && !!coreVoting && !!gscVault;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Joining GSC...",
    successMessage: "GSC joined!",
    errorMessage: "Failed to join GSC.",
    writeFn: async () => {
      if (!enabled) {
        throw new Error("GSC Vault not found");
      }

      // collect the vaults that the signer has voting power in. We can only use
      // those vaults when calling GSCVault.join
      const vaults = await getVaultsWithPower(address, coreVoting.vaults);

      return gscVault.join({ vaults });
    },
  });

  return {
    joinGsc: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
