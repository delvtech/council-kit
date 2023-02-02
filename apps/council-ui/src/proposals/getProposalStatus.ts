export type ProposalStatus =
  | "UNKNOWN"
  | "IN PROGRESS"
  | "EXPIRED"
  | "FAILED"
  | "EXECUTED";

export interface GetProposalStatusOptions {
  isExecuted: boolean;
  endsAtDate: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
}

export function getProposalStatus({
  isExecuted,
  endsAtDate,
  currentQuorum,
  requiredQuorum,
}: GetProposalStatusOptions): ProposalStatus {
  if (isExecuted) {
    return "EXECUTED";
  }

  if (!endsAtDate || !requiredQuorum) {
    return "UNKNOWN";
  }

  if (new Date() > endsAtDate) {
    if (+currentQuorum >= +requiredQuorum) {
      return "EXPIRED";
    } else {
      return "FAILED";
    }
  }

  return "IN PROGRESS";
}
