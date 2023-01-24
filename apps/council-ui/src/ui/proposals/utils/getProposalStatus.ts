const ProposalStatuses = [
  "UNKNOWN",
  "OPEN",
  "PASSING",
  "PASSED",
  "FAILED",
  "EXECUTED",
] as const;
type ProposalStatus = typeof ProposalStatuses[number];

export function getProposalStatus(
  currentQuorum: string,
  requiredQuorum: string | null,
  votingEnds: Date | null,
): ProposalStatus {
  if (!votingEnds || !requiredQuorum) {
    return "UNKNOWN";
  }

  const currentDate = new Date();
  if (currentDate > votingEnds) {
    if (+currentQuorum >= +requiredQuorum) {
      return "PASSED";
    } else {
      return "FAILED";
    }
  }

  if (currentQuorum >= requiredQuorum) {
    return "PASSING";
  } else {
    return "OPEN";
  }
}
