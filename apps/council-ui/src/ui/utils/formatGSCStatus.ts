export type GSCStatus = "Idle" | "Member" | "Eligible" | "Ineligible";

export function formatGSCStatus(
  isIdle = false,
  isMember = false,
  isEligible = false,
): GSCStatus {
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
