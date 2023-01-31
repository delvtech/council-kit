import { GSCVotingContract, VotingContract } from "@council/sdk";
import { parseEther } from "ethers/lib/utils";
import { GSCStatus } from "src/vaults/gscVault/types";

interface GetGSCStatusOptions {
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
  address: string | undefined;
}

export async function getGSCStatus({
  coreVoting,
  gscVoting,
  address,
}: GetGSCStatusOptions): Promise<GSCStatus> {
  if (!gscVoting || !address) {
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
