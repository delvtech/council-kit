import {
  CouncilContext,
  LockingVault,
  VestingVault,
  VotingContract,
} from "@council/sdk";
import { utils, Wallet } from "ethers";
import { getSpectralAddress } from "src/addresses/spectralAddresses";
import { provider } from "src/provider";

import ProxyAdminJson from "src/artifacts/ProxyAdmin.json";

// approx 90 days in blocks assuming 12 seconds a block
const NINETY_DAYS_IN_BLOCKS = (90 * 24 * 60 * 60) / 12;

const proxyAdminAddress = "0x198A191CB42573F46be162b53F1bA16230ca2eB4";
const specTokenProxy = "0x8BEAe9284e6FC83076B8931F1c27eDc657b34c3A";
const specTokenV2Impl = "0xA95489C36630EE65000B1A4dC82f1F04eA1dF33C";
const specTokenV3Impl = "0xEd4E5654C0e9e708980d276801EEd703640055a6";

// wrap the script in an async function so we can await promises
export async function createProposal(): Promise<void> {
  const addresses = await getSpectralAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // create model instances
  const lockingVault = new LockingVault(addresses.lockingVault, context);
  const vestingVault = new VestingVault(addresses.vestingVault, context);
  const coreVoting = new VotingContract(
    addresses.coreVoting,
    [lockingVault, vestingVault],
    context,
  );

  // create a signer for the proposal transaction
  const signer = new Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

  // prep arguments

  // the vaults that will be used to cast the first vote
  const vaults = [];

  // trying to create a proposal with vaults you have no power in will throw an
  // uninitialized error.
  const lockingVaultVotingPower = await lockingVault.getVotingPower(
    signer.address,
  );
  if (+lockingVaultVotingPower > 0) {
    vaults.push(lockingVault);
  }

  // the target contract addresses for the proposal
  const targets = [proxyAdminAddress];

  // get the ProxyAdmin contract abi to encode call data
  const proxyAdminInterface = new utils.Interface(ProxyAdminJson.abi);

  // the proposed calls datas to send to the targets
  const calldatas = [
    proxyAdminInterface.encodeFunctionData("upgrade", [
      specTokenProxy, // SpecTokenProxy
      specTokenV2Impl, // SpecTokenV2Impl
    ]),
  ];

  const currentBlock = await provider.getBlockNumber();

  // the block number after which the proposal can no longer be executed
  const lastCall = currentBlock + NINETY_DAYS_IN_BLOCKS;

  // the ballot to cast for the first vote
  const ballot = "yes";

  const tx = await coreVoting.createProposal(
    signer,
    vaults,
    targets,
    calldatas,
    lastCall,
    ballot,
  );

  console.log(tx);

  process.exit();
}

createProposal();
