import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

interface UseDelegateOptions {
  vault: Address;
  account: Address | undefined;
}

export function useDelegate({ vault, account }: UseDelegateOptions) {
  const council = useReadCouncil();
  const enabled = !!account && !!council;

  return useQuery({
    queryKey: ["delegate", vault, account],
    enabled,
    queryFn: enabled
      ? () => {
          const _vault =
            typeof vault === "string" ? council.vestingVault(vault) : vault;
          return _vault.getDelegate(account);
        }
      : undefined,
  });
}
