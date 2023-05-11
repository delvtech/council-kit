import { deployCoreVoting } from "src/coreVoting/deployCoreVoting";
import { deployTimelock } from "src/timelock/deployTimelock";
import { deployTreasury } from "src/treasury/deployTreasury";
import { deployVotingToken } from "src/votingToken/deployVotingToken";
import { deployGSCVault } from "src/vaults/deployGSCVault";
import { deployLockingVault } from "src/vaults/lockingVault/deployLockingVault";
import { deployVestingVault } from "src/vaults/deployVestingVault";
import { deployGSCCoreVoting } from "src/coreVoting/deployGSCCoreVoting";
import { Contract, Signer, constants } from "ethers";
import { config } from "dotenv";
config();

export async function deployCouncil(signer: Signer): Promise<
  {
    address: string;
    contract: Contract;
    name: string;
    deploymentArgs: unknown[];
  }[]
> {
  const signerAddress = await signer.getAddress();
  console.log("Signer:", signerAddress);

  const chainId = await signer.getChainId();
  const isLocalHost = chainId === 31337;

  // Return all of the contracts that get deployed
  const deployedContracts = [];

  // The voting token is used to determine voting power in the Locking Vault and
  // Vesting Vault. It has no dependencies on any of the council contracts.
  let votingTokenAddress = process.env.VOTING_TOKEN_ADDRESS;
  if (!votingTokenAddress) {
    const votingToken = await deployVotingToken({
      tokenName: "Council Voting Token",
      tokenSymbol: "CVT",
      signer,
    });
    votingTokenAddress = votingToken.address;
    deployedContracts.push(votingToken);
  }

  // The GSC Core Voting is a privileged voting contract which enables a small
  // number of people to create proposals and pass them without a general
  // population vote. This is useful to combat voter fatigue on boring,
  // operational upgrades or quickly respond to time-sensitive matters.
  const gscCoreVoting = await deployGSCCoreVoting({
    signer,
    // The GSCVault cannot be deployed before the GSCCoreVoting contract, so we
    // set this to an empty array for now. We'll approve the GSCVault at the end
    // of this script instead.
    votingVaultAddresses: [],
    // Temporarily set the owner as the current signer. This way we can approve
    // the GSC Voting Vault once it's been created. At the end, we'll reassign
    // the owner to the Timelock so upgrades to this contract have to go through
    // the normal proposal flow.
    ownerAddress: signerAddress,
    // base quorum is 1 so it only takes 1 gsc member to pass a proposal
    baseQuorum: process.env.GSC_BASE_QUORUM ?? "1",
    lockDuration: +(
      process.env.GSC_LOCK_DURATION ?? (isLocalHost ? "0" : "10")
    ),
    extraVotingTime: +(process.env.GSC_EXTRA_VOTING ?? "15"),
  });

  // The Timelock is in charge of executing proposals that upgrade the protocol.
  // Here's how it works. First, a proposal is created and executed in
  // CoreVoting which registers a call in the Timelock. After the
  // waitTimeInBlocks has passed, anyone can call Timelock.execute() to complete
  // the protocol upgrade.
  const timelock = await deployTimelock({
    signer,
    // can execute a call 10 blocks after it's registered
    waitTimeInBlocks: +(process.env.WAIT_BLOCKS ?? (isLocalHost ? "0" : "10")),
    // Temporarily set the owner as the current signer. We will reassign the
    // owner to CoreVoting at the end so that only community votes can govern
    // the system.
    ownerAddress: signerAddress,
    // The GSC has one special privilege in the Timelock. They can invoke a
    // "speedbump" method to increase the waitTimeInBlocks for a given
    // registered call. This is a security feature.
    gscCoreVotingAddress: gscCoreVoting.address,
  });

  // The treasury holds the protocol funds. Proposals can be made to allocate
  // these funds as the community sees fit.
  let treasuryAddress = process.env.TREASURY_ADDRESS;
  if (!treasuryAddress || treasuryAddress === constants.AddressZero) {
    const treasury = await deployTreasury({
      signer,
      ownerAddress: timelock.address,
    });
    treasuryAddress = treasury.address;
    deployedContracts.push(treasury);
  }

  // The Locking Vault allows you to deposit voting tokens in exchange for
  // voting power. This is actually a proxy contract so that the underlying
  // Locking Vault contract can be upgraded as needed.
  const { lockingVault, lockingVaultProxy } = await deployLockingVault({
    signer,
    votingTokenAddress,
    // Set the Timelock as the owner of the proxy contract so that upgrades must
    // go through the normal proposal flow
    proxyOwnerAddress: timelock.address,
    // 300k blocks ~ 1 week on goerli
    staleBlockLag: isLocalHost ? 10 : 300_000,
  });

  // The Vesting Vault is similar to the Locking Vault, however the voting power
  // isn't 1:1 with the number of deposited voting tokens. There are also limits
  // on withdrawing tokens as defined by a vesting schedule.
  const { vestingVault, vestingVaultProxy } = await deployVestingVault({
    signer,
    votingTokenAddress,
    // Set the Timelock as the owner of the proxy contract so that upgrades must
    // go through the normal proposal flow
    proxyOwnerAddress: timelock.address,
    timelockAddress: timelock.address,
    // 300k blocks ~ 1 week on goerli
    staleBlockLag: isLocalHost ? 10 : 300_000,
  });

  const coreVoting = await deployCoreVoting({
    signer,
    timelockAddress: timelock.address,
    votingVaultAddresses: [
      lockingVaultProxy.address,
      vestingVaultProxy.address,
    ],
    // set quorum to 50 ELFI so any test account can pass a vote
    baseQuorum: process.env.BASE_QUORUM ?? "50",
    // set minProposalPower to 50 ELFI so any test account can make a proposal
    minProposalPower: process.env.MIN_PROPOSAL_POWER ?? "50",
    // the GSC does not have a voting power requirement to submit a proposal
    gscCoreVotingAddress: gscCoreVoting.address,
    // can execute a proposal 10 blocks after it gets created
    lockDuration: +(process.env.LOCK_DURATION ?? isLocalHost ? 0 : 10),
    // can still vote on a proposal for this many blocks after it unlocks
    extraVotingTime: +(
      process.env.EXTRA_VOTING ?? (isLocalHost ? "10" : "300000")
    ), // ~ 1 week on goerli
  });

  const gscVault = await deployGSCVault({
    signer,
    ownerAddress: timelock.address,
    // GSC vault depends on core voting contract to prove that members meet the
    // voting power minimum to be on the GSC.
    coreVotingAddress: coreVoting.address,
    // any test account can get onto GSC with this much vote power
    votingPowerBound: process.env.GSC_VOTING_POWER_BOUND ?? "100",
    // members are idle for 60 seconds after they join the GSC
    idleDuration: +(process.env.GSC_IDLE_DURATION ?? "60"),
  });

  // The GSC Vault must be created *after* the GSCCoreVoting contract is
  // deployed, so we approve the gsc vault after the fact. We can do this
  // because the signer is still the owner.
  await gscCoreVoting.contract.changeVaultStatus(gscVault.address, true);
  console.log("Approved GSCVault on GSCCoreVoting");

  // Now we transfer ownership to the Timelock, any future upgrades to
  // GSCCoreVoting must go through the normal proposal flow.
  await gscCoreVoting.contract.setOwner(timelock.address);
  console.log("Set owner of GSCCoreVoting to Timelock");

  // Setting the CoreVoting contract as the owner of the Timelock allows
  // executed proposals to register calls on the Timelock.
  await timelock.contract.setOwner(coreVoting.address);
  console.log("Set owner of Timelock to CoreVoting");

  console.log("All contracts deployed!");
  deployedContracts.push(
    coreVoting,
    gscCoreVoting,
    gscVault,
    lockingVault,
    lockingVaultProxy,
    timelock,
    vestingVault,
    vestingVaultProxy,
  );
  return deployedContracts;
}
