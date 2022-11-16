export type GSCStatus = "Idle" | "Member" | "Eligible" | "Ineligible";

export function formatGSCStatus(
  isIdle = false,
  isMember = false,
  isEligible = false,
): GSCStatus {
  return isIdle
    ? "Idle"
    : isMember
    ? "Member"
    : isEligible
    ? "Eligible"
    : "Ineligible";
}
