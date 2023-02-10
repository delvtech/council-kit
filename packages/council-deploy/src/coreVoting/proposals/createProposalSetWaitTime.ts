import { BytesLike, ethers, Wallet } from "ethers";

// Helpers
import { CoreVoting__factory, Timelock__factory } from "@council/typechain";
import { goerliDeployments } from "src/deployments";
import { ContractDeploymentInfo } from "src/deployments/types";
import hre from "hardhat";
import { Provider } from "@ethersproject/providers";
import { createProposalCallHash } from "src/coreVoting/proposals/createCallHash";

const provider = hre.ethers.provider;
const signer = new Wallet(
  // using danny.elf-goerli.eth since there's enough VP on it
  process.env.GOERLI_DEPLOYER_PRIVATE_KEY as string,
  provider,
);
const DAY_IN_BLOCKS = 6496;
const YEAR_IN_DAYS = 365;
const ONE_WEEK_IN_DAYS = 7;

const { contracts } = goerliDeployments[goerliDeployments.length - 1];
const coreVoting = contracts.find(
  ({ name }) => name === "CoreVoting",
) as ContractDeploymentInfo;
const timelock = contracts.find(
  ({ name }) => name === "Timelock",
) as ContractDeploymentInfo;
const lockingVaultProxy = contracts.find(
  ({ name }) => name === "LockingVaultProxy",
) as ContractDeploymentInfo;

/********************************************************************************
 * Set up a new proposal. This proposal will update the wait time for the
 * Timelock contract. The wait time is the number of blocks that must pass
 * before a proposal can be executed*
 ********************************************************************************/
export async function createGoerliProposal(
  owner: Wallet,
  provider: Provider,
): Promise<void> {
  const coreVotingContract = CoreVoting__factory.connect(
    coreVoting.address,
    owner,
  );
  const tInterface = new ethers.utils.Interface(Timelock__factory.abi);

  // setup calldata for timelock's setTime function.
  const newWaitTime = 1;
  const calldatasTimelock = [
    tInterface.encodeFunctionData("setWaitTime", [newWaitTime]),
  ];

  // get the callhash, this is how Timelock determines if the call is valid before it executes it
  const targetsTimelock = [timelock.address];
  const callHash = await createProposalCallHash(
    targetsTimelock,
    calldatasTimelock,
  );

  // calldata for the coreVoting contract
  const calldataCoreVoting = tInterface.encodeFunctionData("registerCall", [
    callHash,
  ]);

  // you must also vote when creating a proposal, this specifies which vaults to
  // vote from
  const votingVaults = [lockingVaultProxy.address];

  // note that lockingVault/vestingVault doesn't require extra data when querying vote power, so we stub with "0x00"
  const extraVaultData = ["0x00"];
  const targets = [timelock.address];
  const callDatas = [calldataCoreVoting];
  const currentBlock = await provider.getBlockNumber();

  // set a large last call so we can execute when we want
  // note that the extra vote time is one year right now, so setting last call to one year and one week
  const lastCall =
    currentBlock +
    DAY_IN_BLOCKS * YEAR_IN_DAYS +
    DAY_IN_BLOCKS * ONE_WEEK_IN_DAYS;

  /********************************************************************************
   * Create the proposal
   ********************************************************************************/

  const ballot = 2; // 2 is abstain
  const tx = await coreVotingContract.proposal(
    votingVaults,
    extraVaultData,
    targets,
    callDatas,
    lastCall,
    ballot,
    // overrides,
  );
  await tx.wait(1);

  /********************************************************************************
   * Print data about the proposal
   ********************************************************************************/
  const proposalCreatedEvents = await coreVotingContract.queryFilter(
    coreVotingContract.filters.ProposalCreated(),
  );

  const proposalArgs = [
    ["proposalId", proposalCreatedEvents.length - 1],
    ["votingVaults", votingVaults],
    ["extraVaultData", extraVaultData],
    ["callDatasTimelock", calldatasTimelock],
    ["targetsTimelock", targetsTimelock],
    ["targets", targets],
    ["callDatas", callDatas],
    ["lastCall", lastCall],
    ["ballot", ballot],
  ];

  console.log("Proposal created with:");
  proposalArgs.forEach(([name, value]) => console.log(name, value));
}

createGoerliProposal(signer, provider)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
