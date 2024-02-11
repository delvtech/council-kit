import { VoteResults } from "@delvtech/council-viem";

export type ProposalStatus =
  | "UNKNOWN"
  | "IN PROGRESS"
  | "EXPIRED"
  | "FAILED"
  | "EXECUTED";

export interface GetProposalStatusOptions {
  lastCallDate: Date | undefined;
  requiredQuorum: bigint | undefined;
  currentQuorum?: bigint;
  isExecuted?: boolean;
  results?: VoteResults;
}

export function getProposalStatus({
  lastCallDate,
  requiredQuorum,
  currentQuorum = BigInt(0),
  isExecuted = false,
  results = {
    yes: BigInt(0),
    no: BigInt(0),
    maybe: BigInt(0),
  },
}: GetProposalStatusOptions): ProposalStatus {
  if (isExecuted) {
    return "EXECUTED";
  }

  if (!lastCallDate || !requiredQuorum) {
    return "UNKNOWN";
  }

  if (new Date() > lastCallDate) {
    if (currentQuorum >= requiredQuorum && results.yes > results.no) {
      return "EXPIRED";
    } else {
      return "FAILED";
    }
  }

  return "IN PROGRESS";
}
