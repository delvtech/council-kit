import { Address, OneOf } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import {
  GscVotingContractConfig,
  VotingContractConfig,
} from "src/config/types";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getVotingContractConfig({
  address,
  chainId,
}: {
  address: Address;
  chainId: SupportedChainId;
}): AnyVotingContractConfig | undefined {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);
  if (coreVoting.address === address) {
    return { ...coreVoting, isGsc: false };
  }
  if (gscVoting?.address === address) {
    return { ...gscVoting, isGsc: true };
  }
}

export type AnyVotingContractConfig = OneOf<
  | (VotingContractConfig & { isGsc: false })
  | (GscVotingContractConfig & { isGsc: true })
>;
