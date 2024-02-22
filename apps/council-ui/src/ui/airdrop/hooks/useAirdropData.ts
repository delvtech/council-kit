import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { AirdropData, getAirdropData } from "src/utils/getAirdropData";
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

  const { data, status } = useQuery<AirdropData | null>({
    queryKey: ["useAirdropData", address, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          const data = await getAirdropData(address, chainId);
          return data || null;
        }
      : undefined,
  });

  return {
    airdropData: data || undefined,
    status,
  };
}
