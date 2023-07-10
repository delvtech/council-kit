import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useCouncil } from "src/ui/council/useCouncil";
import { useAccount } from "wagmi";
import { useAirdropData } from "./useAirdropData";

/**
 * Fetch the amount of an airdrop that can still be claimed by the connected
 * wallet address.
 */
export function useClaimableAirdropAmount(): UseQueryResult<string> {
  const { airdrop } = useCouncil();
  const { address } = useAccount();
  const { data, status } = useAirdropData();

  const enabled = !!airdrop && !!address && status !== "loading";

  return useQuery<string>({
    queryKey: ["claimableAirdropAmount", airdrop?.address, address, data],
    enabled,
    queryFn: enabled
      ? async () => {
          if (!data || !+data.amount) {
            return "0";
          }

          const claimed = await airdrop.getClaimedAmount(address);
          const token = await airdrop.getToken();
          const decimals = await token.getDecimals();

          const amountBigNumber = parseUnits(data.amount, decimals);
          const claimedBigNumber = parseUnits(claimed, decimals);
          const claimableBigNumber = amountBigNumber.sub(claimedBigNumber);

          return formatUnits(claimableBigNumber, decimals);
        }
      : undefined,
  });
}
