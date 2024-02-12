import { QueryStatus, useQuery } from "@tanstack/react-query";
import { AirdropData, getAirdropData } from "src/utils/getAirdropData";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useAccount } from "wagmi";

/**
 * Fetch the data needed to claim an airdrop for the connected wallet address.
 * If the address doesn't have an airdrop, `airdropData` will be `undefined`.
 */
export function useAirdropData(): {
  airdropData: AirdropData | undefined;
  status: QueryStatus;
} {
  const { address } = useAccount();
  const chainId = useSupportedChainId();

  const enabled = !!address && !!chainId;

  const { data, status } = useQuery<AirdropData | undefined>({
    queryKey: ["useAirdropData", address, chainId],
    enabled,
    queryFn: enabled ? () => getAirdropData(address, chainId) : undefined,
  });

  return {
    airdropData: data,
    status,
  };
}
