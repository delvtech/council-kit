import { BigNumber } from "ethers";

export interface ProposalMetadata {
  proposalHash: string;
  created: number;
  createdTransactionHash: string | null;
  executedTransactionHash: string | null;
  unlock: number;
  expiration: number;
  quorum: BigNumber;
  lastCall: number;
}
