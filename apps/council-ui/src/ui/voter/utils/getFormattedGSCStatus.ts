import { GSCVotingContract } from "@council/sdk";
import { formatGSCStatus, GSCStatus } from "src/ui/utils/formatGSCStatus";

export async function getFormattedGSCStatus(
  address: string,
  gscVoting: GSCVotingContract,
): Promise<GSCStatus> {
  const isIdle = await gscVoting?.getIsIdle(address as string);
  const isMember = await gscVoting?.getIsMember(address as string);
  const isEligible = await gscVoting?.getIsEligible(address as string);

  return formatGSCStatus({ isIdle, isMember, isEligible });
}
