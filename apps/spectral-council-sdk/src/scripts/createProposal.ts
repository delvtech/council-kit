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

const proxyAdminAddress = "0x46a8049944C7d0E65B81145Dec33d4A9a0Fb72CD";
const specTokenProxy = "0x99E542507D938a2297d075C66a64E66c16BD27E4";
const specTokenV2Impl = "0xEe84d28e1B26638a56026764512dEeB8A8a6d1A5";

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
