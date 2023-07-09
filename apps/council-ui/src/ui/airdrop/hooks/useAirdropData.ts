import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AirdropData, getAirdropData } from "src/airdrop/getAirdropData";
import { useChainId } from "src/ui/network/useChainId";
import { useAccount } from "wagmi";

/**
 * Fetch the data needed to claim an airdrop for the connected wallet address.
 * If the address doesn't have an airdrop, `airdropData` will be `undefined`.
 */
export function useAirdropData(): UseQueryResult<AirdropData | undefined> {
  const { address } = useAccount();
  const chainId = useChainId();

  const enabled = !!address && !!chainId;

  return useQuery<AirdropData | undefined>({
    queryKey: ["airdropData", address, chainId],
    enabled,
    queryFn: enabled ? () => getAirdropData(address, chainId) : undefined,
  });
}
