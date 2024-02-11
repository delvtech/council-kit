import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadAirdrop } from "src/ui/airdrop/hooks/useReadAirdrop";
import { useTokenDecimals } from "src/ui/token/hooks/useTokenDecimals";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useAirdropData } from "./useAirdropData";
import { useAirdropToken } from "./useAirdropToken";

/**
 * Fetch the amount that can still be claimed from the configured airdrop by the
 * connected wallet address.
 */
export function useClaimableAirdropAmount(): {
  claimableAmount: bigint;
  claimableAmountFormatted: `${number}`;
  status: QueryStatus;
} {
  const airdrop = useReadAirdrop();
  const { address: account } = useAccount();
  const { airdropData, status: dataStatus } = useAirdropData();
  const { airdropToken } = useAirdropToken();
  const { decimals } = useTokenDecimals(airdropToken);

  const enabled = !!airdrop && !!account && dataStatus === "success";

  const { data, status } = useQuery<bigint>({
    queryKey: [
      "useClaimableAirdropAmount",
      airdrop?.address,
      account,
      airdropData,
    ],
    enabled,
    queryFn: enabled
      ? async () => {
          if (!airdropData || !airdropData.amount) {
            return BigInt(0);
          }
          const claimed = await airdrop.getClaimedAmount({ account });
          return airdropData.amount - claimed;
        }
      : undefined,
  });

  const claimableAmountFormatted =
    data !== undefined && decimals !== undefined
      ? formatUnits(data, decimals)
      : "0";

  return {
    claimableAmount: data ?? BigInt(0),
    claimableAmountFormatted: claimableAmountFormatted as `${number}`,
    status,
  };
}
