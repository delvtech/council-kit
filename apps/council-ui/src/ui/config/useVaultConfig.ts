import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";

export function useCouncilConfig({
  address,
  chainId,
}: {
  address: Address;
  chainId?: SupportedChainId;
}) {
  const config = useCouncilConfig(chainId);

  return config;
}
