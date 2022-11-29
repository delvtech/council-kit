import { useEnsName } from "wagmi";
import { formatAddress } from "./formatAddress";

export function useDisplayName(
  address: string | undefined,
): string | undefined {
  const { data: ensName } = useEnsName({
    address: address as `0x{string}` | undefined,
  });
  return ensName || (address && formatAddress(address));
}
