export type GSCStatus = "Idle" | "Member" | "Eligible" | "Ineligible";

interface GSCStatusOptions {
  isIdle?: boolean;
  isMember?: boolean;
  isEligible?: boolean;
}

export function formatGSCStatus({
  isIdle = false,
  isMember = false,
  isEligible = false,
}: GSCStatusOptions = {}): GSCStatus {
  if (isIdle) {
    return "Idle";
  }
  if (isMember) {
    return "Member";
  }
  if (isEligible) {
    return "Eligible";
  }
  return "Ineligible";
}
