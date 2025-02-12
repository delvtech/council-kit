import { Address } from "@delvtech/drift";

export type Grant = {
  allocation: bigint;
  withdrawn: bigint;
  createdBlock: bigint;
  expirationBlock: bigint;
  cliffBlock: bigint;
  latestVotingPower: bigint;
  delegatee: Address;
  range: readonly [bigint, bigint];
};
