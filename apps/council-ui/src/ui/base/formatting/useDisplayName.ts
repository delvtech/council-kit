import { useEnsName } from "wagmi";
import { formatAddress } from "./formatAddress";

export function useDisplayName(address: string): string {
  const { data: ensName } = useEnsName({ address: address as `0x{string}` });
  return ensName || formatAddress(address);
}
