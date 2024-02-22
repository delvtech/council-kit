import { BlockLike } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useAccount } from "wagmi";

interface UseVotingPowerOptions {
  account?: `0x${string}` | undefined;
  atBlock?: BlockLike;
}

/**
 * Get the voting power of a wallet in all configured
 * vaults.
 * @param account The account to get voting power for. If not provided, the
 * connected account will be used.
 */
export function useVotingPower({
  account,
  atBlock,
}: UseVotingPowerOptions = {}): {
  votingPower: bigint | undefined;
  votingPowerFormatted: string | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const coreVoting = useReadCoreVoting();
  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;

  const enabled = !!accountToUse;

  const { data, status } = useQuery({
    queryKey: ["votingPower", account, chainId],
    enabled,
    queryFn: enabled
      ? () =>
          Promise.all(
            coreVoting.vaults.map(({ getVotingPower }) =>
              getVotingPower({ account: accountToUse, atBlock }),
            ),
          )
      : undefined,
  });

  const votingPower = data?.reduce((a, b) => a + b, 0n);

  return {
    votingPower,
    /**
     * All voting power is formatted as a string with 18 decimal places.
     */
    votingPowerFormatted:
      votingPower !== undefined ? formatEther(votingPower) : undefined,
    status,
  };
}
