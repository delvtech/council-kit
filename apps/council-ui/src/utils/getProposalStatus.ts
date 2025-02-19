import { VoteResults } from "@delvtech/council-js";

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
  currentQuorum = 0n,
  isExecuted = false,
  results = {
    yes: 0n,
    no: 0n,
    maybe: 0n,
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
