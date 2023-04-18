import { GSCVotingContract, VotingContract } from "@council/sdk";
import { parseEther } from "ethers/lib/utils";

interface GetIsGSCEligibleOptions {
  address: string;
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
}

export async function getIsGSCEligible({
  address,
  coreVoting,
  gscVoting,
}: GetIsGSCEligibleOptions): Promise<boolean> {
  if (!gscVoting) {
    return false;
  }

  const votingPower = await coreVoting.getVotingPower(address);
  const requiredVotingPower = await gscVoting.getRequiredVotingPower();

  if (parseEther(votingPower).gt(parseEther(requiredVotingPower))) {
    return true;
  }

  return false;
}
