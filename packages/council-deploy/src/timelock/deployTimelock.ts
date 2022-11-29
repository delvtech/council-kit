import { Timelock, Timelock__factory } from "@council/typechain";
import { Signer } from "ethers";

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
}: DeployTimelockOptions): Promise<Timelock> {
  const timeLockDeployer = new Timelock__factory(signer);
  const timelock = await timeLockDeployer.deploy(
    waitTimeInBlocks,
    ownerAddress,
    gscCoreVotingAddress,
  );
  console.log("Deployed Timelock");

  // gsc is authorized so that it can delay the execution of proposals in the
  // timelock
  await timelock.authorize(gscCoreVotingAddress);

  return timelock;
}
