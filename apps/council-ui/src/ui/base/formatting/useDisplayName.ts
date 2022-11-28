import { useEnsName } from "wagmi";
import { formatAddress } from "./formatAddress";

export function useDisplayName(address: `0x${string}`): string {
  const { data: ensName } = useEnsName({ address });
  return ensName || formatAddress(address);
}
