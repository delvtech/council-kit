import { VoteResults } from "@council/sdk";
import { parseEther } from "ethers/lib/utils";

export type ProposalStatus =
  | "UNKNOWN"
  | "IN PROGRESS"
  | "EXPIRED"
  | "FAILED"
  | "EXECUTED";

export interface GetProposalStatusOptions {
  isExecuted: boolean;
  lastCallDate: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
  results: VoteResults;
}

export function getProposalStatus({
  isExecuted,
  lastCallDate,
  currentQuorum,
  requiredQuorum,
  results,
}: GetProposalStatusOptions): ProposalStatus {
  if (isExecuted) {
    return "EXECUTED";
  }

  if (!lastCallDate || !requiredQuorum) {
    return "UNKNOWN";
  }

  if (new Date() > lastCallDate) {
    if (
      +currentQuorum >= +requiredQuorum &&
      parseEther(results.yes).gt(parseEther(results.no))
    ) {
      return "EXPIRED";
    } else {
      return "FAILED";
    }
  }

  return "IN PROGRESS";
}
