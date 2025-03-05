import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import {
  GscVotingContractConfig,
  VotingContractConfig,
} from "src/config/types";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getVotingContractConfig({
  chainId,
  address,
}: {
  chainId: SupportedChainId;
  address: Address;
}): ExtendedVotingContractConfig | undefined {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);
  if (coreVoting.address === address) {
    return {
      ...coreVoting,
      isGsc: false,
      chainId,
    };
  }
  if (gscVoting?.address === address) {
    return {
      ...gscVoting,
      isGsc: true,
      chainId,
    };
  }
}

export type ExtendedVotingContractConfig = (
  | (VotingContractConfig & { isGsc: false })
  | (GscVotingContractConfig & { isGsc: true })
) & {
  chainId: SupportedChainId;
};
