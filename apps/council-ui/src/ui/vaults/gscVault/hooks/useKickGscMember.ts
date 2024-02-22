import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteGscVault } from "./useReadWriteGscVault";

export function useKickGscMember(): {
  kickGscMember: ((account: `0x${string}`) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const gscVault = useReadWriteGscVault();
  const enabled = !!gscVault;

  const { write, status, transactionHash } = useWrite({
    writeFn: async (account: `0x${string}`) => {
      if (!enabled) {
        throw new Error("GSC Vault not found");
      }

      return gscVault.kick({ account });
    },
  });

  return {
    kickGscMember: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
