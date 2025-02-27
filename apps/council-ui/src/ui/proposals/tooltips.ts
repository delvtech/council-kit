import { ProposalStatus } from "@delvtech/council-js";

export const tooltipByStatus: Record<ProposalStatus, string> = {
  executed: "This proposal passed and was executed.",
  expired:
    "This proposal garnered sufficient 'Yes' votes to pass, but was not executed prior to the deadline (i.e., last call).",
  failed: "This proposal did not meet quorum and/or failed to pass.",
  active:
    "This proposal is currently active and either awaiting more votes or execution.",
  unknown: "This proposal is missing information regarding its status.",
};
