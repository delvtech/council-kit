import { MutationStatus } from "@tanstack/react-query";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useWrite } from "src/ui/contract/useWrite";
import { useAccount } from "wagmi";
import { useReadWriteGscVault } from "./useReadWriteGscVault";

export function useJoinGsc(): {
  joinGsc: (() => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const { address } = useAccount();
  const config = useCouncilConfig();
  const gscVault = useReadWriteGscVault();
  const enabled = !!address && !!gscVault;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Joining GSC...",
    successMessage: "GSC joined!",
    errorMessage: "Failed to join GSC.",
    writeFn: enabled
      ? async () => {
          const vaults = config.coreVoting.vaults.map(({ address }) => address);
          return gscVault.join({ args: { vaults } });
        }
      : undefined,
  });

  return {
    joinGsc: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
