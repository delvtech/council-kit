import { GSCVotingContract, VotingContract } from "@council/sdk";
import { parseEther } from "ethers/lib/utils";

export type GSCStatus = "N/A" | "Idle" | "Member" | "Eligible" | "Ineligible";

interface GetGSCStatusOptions {
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
  address: string;
}

export async function getGSCStatus({
  coreVoting,
  gscVoting,
  address,
}: GetGSCStatusOptions): Promise<GSCStatus> {
  if (!gscVoting) {
    return "N/A";
  }

  if (await gscVoting.getIsIdle(address)) {
    return "Idle";
  }

  if (await gscVoting.getIsMember(address)) {
    return "Member";
  }

  const votingPower = await coreVoting.getVotingPower(address);
  const requiredVotingPower = await gscVoting.getRequiredVotingPower();

  if (parseEther(votingPower).gt(parseEther(requiredVotingPower))) {
    return "Eligible";
  }

  return "Ineligible";
}
