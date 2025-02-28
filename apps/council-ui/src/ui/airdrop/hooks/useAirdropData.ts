import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { AirdropData, getAirdropData } from "src/utils/getAirdropData";
import { useAccount } from "wagmi";

/**
 * Fetch the data needed to claim an airdrop for the connected wallet address.
 * If the address doesn't have an airdrop, `airdropData` will be `undefined`.
 */
export function useAirdropData({
  chainId,
}: { chainId?: SupportedChainId } = {}) {
  const { address } = useAccount();
  const enabled = !!address && !!chainId;
  return useQuery<AirdropData | null>({
    queryKey: ["useAirdropData", address, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          const data = await getAirdropData({ account: address, chainId });
          return data || null;
        }
      : undefined,
  });
}
