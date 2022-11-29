import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CoreVoting, CoreVoting__factory } from "@council/typechain";
import { parseEther } from "ethers/lib/utils";

interface DeployCoreVotingOptions {
  signer: SignerWithAddress;
  votingVaultAddresses: string[];
  timelockAddress: string;
  baseQuorum: string;
  minProposalPower: string;
  gscCoreVotingAddress: string;
  /**
   * Minimum number of blocks a proposal must be active for before executing
   * Default: 10 blocks
   */
  lockDuration?: number;
  /**
   * The number of blocks after the proposal is unlocked during which voting can
   * continue.  Default: 15 blocks
   */
  extraVotingTime?: number;
}

export async function deployCoreVoting({
  signer,
  votingVaultAddresses,
  timelockAddress,
  baseQuorum,
  minProposalPower,
  gscCoreVotingAddress,
  lockDuration = 10,
  extraVotingTime = 15,
}: DeployCoreVotingOptions): Promise<CoreVoting> {
  const coreVotingDeployer = new CoreVoting__factory(signer);
  const coreVoting = await coreVotingDeployer.deploy(
    await signer.getAddress(),
    parseEther(baseQuorum),
    parseEther(minProposalPower),
    gscCoreVotingAddress,
    votingVaultAddresses,
  );
  console.log("Deployed CoreVoting");

  (await coreVoting.setLockDuration(lockDuration)).wait(1);
  (await coreVoting.changeExtraVotingTime(extraVotingTime)).wait(1);
  console.log("Set CoreVoting lockDuration and extraVoteTime");

  await coreVoting.setOwner(timelockAddress);
  console.log("Set owner of CoreVoting to Timelock");

  return coreVoting;
}
