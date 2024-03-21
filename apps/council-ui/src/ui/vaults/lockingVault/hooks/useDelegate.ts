import { ReadLockingVault, ReadVoter } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";

interface UseDelegateOptions {
  vault: ReadLockingVault | `0x${string}` | undefined;
  account: `0x${string}` | undefined;
}

interface DelegateResult {
  delegate: ReadVoter;
  status: QueryStatus;
}

export function useDelegate({
  vault,
  account,
}: UseDelegateOptions): DelegateResult {
  const council = useReadCouncil();
  const enabled = !!vault && !!account;

  const { data, status } = useQuery({
    queryKey: ["delegate", vault, account],
    enabled,
    queryFn: enabled
      ? () => {
          const _vault =
            typeof vault === "string" ? council.lockingVault(vault) : vault;
          return _vault.getDelegate({ account });
        }
      : undefined,
  });

  return {
    delegate: data as ReadVoter,
    status,
  };
}
