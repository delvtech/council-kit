import { CoreVoting__factory } from "@council/typechain";
import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployCoreVotingOptions {
  signer: Signer;
  votingVaultAddresses: string[];
  timelockAddress: string;
  baseQuorum: string;
  minProposalPower: string;
  /**
   * the GSC does not have a voting power requirement to submit a proposal
   */
  gscCoreVotingAddress: string;

  /**
   * Minimum number of blocks a proposal must be active for before executing
   * Default: 10 blocks
   */
  lockDuration?: number;

  /**
   * The number of blocks after the proposal is unlocked during which voting can
   * continue.
   *
   * Default: 15 blocks, this is reasonable for Goerli but probably not mainnet
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
}: DeployCoreVotingOptions): Promise<
  ContractWithDeploymentArgs<CoreVoting__factory>
> {
  console.log("Deploying CoreVoting...");
  const coreVotingFactory = new CoreVoting__factory(signer);
  const deploymentArgs: DeployArguments<CoreVoting__factory> = [
    await signer.getAddress(),
    parseEther(baseQuorum).toHexString(),
    parseEther(minProposalPower).toHexString(),
    gscCoreVotingAddress,
    votingVaultAddresses,
  ];
  const coreVoting = await coreVotingFactory.deploy(...deploymentArgs);
  await coreVoting.deployTransaction.wait(1);
  console.log(`Deployed CoreVoting @ ${coreVoting.address}`);

  (await coreVoting.setLockDuration(lockDuration)).wait(1);
  (await coreVoting.changeExtraVotingTime(extraVotingTime)).wait(1);
  console.log("Set CoreVoting lockDuration and extraVoteTime");

  await coreVoting.setOwner(timelockAddress);
  console.log("Set owner of CoreVoting to Timelock");

  return {
    address: coreVoting.address,
    name: "CoreVoting",
    contract: coreVoting,
    deploymentArgs,
  };
}
