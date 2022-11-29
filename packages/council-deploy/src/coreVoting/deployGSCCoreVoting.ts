import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import { ethers, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";

interface DeployGSCCoreVotingOptions {
  signer: Wallet;
  ownerAddress: string;
  votingVaultAddresses: string[];
  /**
   * The number of votes required to pass a proposal
   */
  baseQuorum: string;
  /**
   * Minimum number of blocks a proposal must be active for before executing
   */
  lockDuration: number;
  /**
   * The number of blocks after the proposal is unlocked during which voting can
   * continue.
   */
  extraVotingTime: number;
}

export async function deployGSCCoreVoting({
  signer,
  ownerAddress,
  baseQuorum,
  lockDuration,
  extraVotingTime,
  votingVaultAddresses,
}: DeployGSCCoreVotingOptions): Promise<CoreVoting> {
  const gscCoreVotingDeployer = new CoreVoting__factory(signer);

  // The GSC is authorized to create proposals without a minProposalPower.
  // Setting this to "1" just to satisfy the required argument for deployment.
  const minProposalPower = parseEther("1");

  const gscCoreVoting = await gscCoreVotingDeployer.deploy(
    ownerAddress,
    parseEther(baseQuorum),
    minProposalPower,
    // There is no GSC for the GSC, otherwise it'd just be turtles all the way
    // down.
    ethers.constants.AddressZero,
    // initial deployment without any voting vaults, later on the owner can call
    // `GSCCoreVoting.changeVaultStatus()` to add approved vaults.
    votingVaultAddresses,
  );
  console.log("Deployed GSCCoreVoting");

  (await gscCoreVoting.setLockDuration(lockDuration)).wait(1);
  (await gscCoreVoting.changeExtraVotingTime(extraVotingTime)).wait(1);
  console.log("Set GSCCoreVoting lockDuration and extraVoteTime");

  return gscCoreVoting;
}
