import { ProposalStatus } from "src/proposals/getProposalStatus";

export const EXECUTED_STATUS = "This proposal passed and was executed.";
export const EXPIRED_STATUS =
  "This proposal garnered sufficient 'Yes' votes to pass, but was not executed prior to the deadline (i.e., last call).";
export const FAILED_STATUS =
  "This proposal did not meet quorum and/or failed to pass.";
export const IN_PROGRESS_STATUS =
  "This proposal is currently active and either awaiting more votes or execution.";
export const UNKNOWN_STATUS =
  "This proposal is missing information regarding its status.";

export const tooltipByStatus: Record<ProposalStatus, string> = {
  EXECUTED: EXECUTED_STATUS,
  EXPIRED: EXPIRED_STATUS,
  FAILED: FAILED_STATUS,
  "IN PROGRESS": IN_PROGRESS_STATUS,
  UNKNOWN: UNKNOWN_STATUS,
};
