import { Address, OneOf } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import {
  CoreVotingContractConfig,
  GscVotingContractConfig,
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
  if (gscVoting?.vault.address === address) {
    return { ...gscVoting, isGsc: true };
  }
}

export type AnyVotingContractConfig = OneOf<
  | (CoreVotingContractConfig & { isGsc: false })
  | (GscVotingContractConfig & { isGsc: true })
>;
