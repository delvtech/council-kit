import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { useAccount } from "wagmi";
import { useAirdropData } from "./useAirdropData";

/**
 * Fetch the amount that can still be claimed from the configured airdrop by the
 * connected wallet address.
 */
export function useClaimableAirdropAmount({
  chainId,
}: { chainId?: SupportedChainId } = {}) {
  chainId = useSupportedChainId(chainId);
  const { airdrop } = useCouncilConfig(chainId);
  const { address: account } = useAccount();
  const { data, status: dataStatus } = useAirdropData({ chainId });
  const council = useReadCouncil({ chainId });

  const enabled =
    !!council && !!data && !!airdrop && !!account && dataStatus === "success";

  return useQuery({
    queryKey: ["useClaimableAirdropAmount", airdrop?.address, account, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          if (!data.amount) {
            return 0n;
          }
          const claimed = await council
            .airdrop(airdrop.address)
            .getClaimedAmount(account);
          return data.amount - claimed;
        }
      : undefined,
  });
}
