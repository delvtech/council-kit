import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

interface UseDelegateOptions {
  vault: Address | undefined;
  voter: Address | undefined;
  chainId?: SupportedChainId;
}

export function useDelegate({ vault, voter, chainId }: UseDelegateOptions) {
  const council = useReadCouncil({ chainId });
  const enabled = !!vault && !!voter && !!council;
  return useQuery({
    queryKey: ["useDelegate", vault, voter, chainId],
    enabled,
    queryFn: enabled
      ? () => council.lockingVault(vault).getDelegate(voter)
      : undefined,
  });
}
