import { useQuery } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { getGscStatus } from "src/utils/gsc/getGscStatus";

export function useGscStatus(account: `0x${string}` | undefined) {
  const chainId = useSupportedChainId();
  return useQuery({
    queryKey: ["gsc-status", account],
    queryFn: () => getGscStatus({ account, chainId }),
  });
}
