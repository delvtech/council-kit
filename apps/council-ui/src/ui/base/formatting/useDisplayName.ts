import { useEnsName } from "wagmi";
import { formatAddress } from "./formatAddress";

export function useDisplayName(
  address: string | null | undefined,
): string | undefined {
  const { data: ensName } = useEnsName({
    address: address as `0x{string}` | undefined,
  });

  // hooks don't let us bail out early, so we do this after the useEnsName call
  if (!address) {
    return;
  }

  if (ensName) {
    return ensName;
  }

  return formatAddress(address);
}
