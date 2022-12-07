import { Timelock__factory } from "@council/typechain";
import { Signer } from "ethers";
import {
  ContractWithDeploymentArgs,
  DeployArguments,
} from "src/base/contractFactory";

interface DeployTimelockOptions {
  signer: Signer;
  waitTimeInBlocks: number;
  ownerAddress: string;
  gscCoreVotingAddress: string;
}

export async function deployTimelock({
  signer,
  waitTimeInBlocks,
  ownerAddress,
  gscCoreVotingAddress,
}: DeployTimelockOptions): Promise<
  ContractWithDeploymentArgs<Timelock__factory>
> {
  const timeLockFactory = new Timelock__factory(signer);
  const deploymentArgs: DeployArguments<Timelock__factory> = [
    waitTimeInBlocks,
    ownerAddress,
    gscCoreVotingAddress,
  ];
  const timelock = await timeLockFactory.deploy(...deploymentArgs);
  console.log("Deployed Timelock");

  // gsc is authorized so that it can use its special privilege of being able
  // to delay the execution of proposals in the timelock
  await timelock.authorize(gscCoreVotingAddress);

  return {
    address: timelock.address,
    name: "Timelock",
    contract: timelock,
    deploymentArgs,
  };
}
