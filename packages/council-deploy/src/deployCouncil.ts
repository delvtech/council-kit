import { deployCoreVoting } from "src/coreVoting/deployCoreVoting";
import { deployTimelock } from "src/timelock/deployTimelock";
import { deployTreasury } from "src/treasury/deployTreasury";
import { deployVotingToken } from "src/token/deployVotingToken";
import { deployGSCVault } from "src/vaults/deployGSCVault";
import { deployLockingVault } from "src/vaults/deployLockingVault";
import { deployVestingVault } from "src/vaults/deployVestingVault";
import { deployGSCCoreVoting } from "src/coreVoting/deployGSCCoreVoting";
import { Contract, Wallet } from "ethers";

export async function deployCouncil(signer: Wallet): Promise<
  {
    address: string;
    contract: Contract;
    name: string;
    type: string;
    deploymentArgs: unknown[];
  }[]
> {
  console.log("Signer:", signer.address);

  // The voting token is used to determine voting power in the Locking Vault and
  // Vesting Vault. It has no dependencies on any of the council contracts.
  const votingToken = await deployVotingToken({
    tokenName: "Council Voting Token",
    tokenSymbol: "CVT",
    signer,
  });

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
    ownerAddress: signer.address,
    // base quorum is 1 so it only takes 1 gsc member to pass a proposal
    baseQuorum: "1",
    lockDuration: 10,
    extraVotingTime: 15,
  });

  // The Timelock is in charge of executing proposals that upgrade the protocol.
  // Here's how it works. First, a proposal is created and executed in
  // CoreVoting which registers a call in the Timelock. After the
  // waitTimeInBlocks has passed, anyone can call Timelock.execute() to complete
  // the protocol upgrade.
  const timelock = await deployTimelock({
    signer,
    // can execute a call 10 blocks after it's registered
    waitTimeInBlocks: 10,
    // Temporarily set the owner as the current signer. We will reassign the
    // owner to CoreVoting at the end so that only community votes can govern
    // the system.
    ownerAddress: signer.address,
    // The GSC has one special privilege in the Timelock. They can invoke a
    // "speedbump" method to increase the waitTimeInBlocks for a given
    // registered call. This is a security feature.
    gscCoreVotingAddress: gscCoreVoting.address,
  });

  // The treasury holds the protocol funds. Proposals can be made to allocate
  // these funds as the community sees fit.
  const treasury = await deployTreasury({
    signer,
    ownerAddress: timelock.address,
  });

  // The Locking Vault allows you to deposit voting tokens in exchange for
  // voting power. This is actually a proxy contract so that the underlying
  // Locking Vault contract can be upgraded as needed.
  const { lockingVault, lockingVaultProxy } = await deployLockingVault({
    signer,
    votingTokenAddress: votingToken.address,
    // Set the Timelock as the owner of the proxy contract so that upgrades must
    // go through the normal proposal flow
    proxyOwnerAddress: timelock.address,
    // 300k blocks ~ 1 week on goerli
    staleBlockLag: 300_000,
  });

  // The Vesting Vault is similar to the Locking Vault, however the voting power
  // isn't 1:1 with the number of deposited voting tokens. There are also limits
  // on withdrawing tokens as defined by a vesting schedule.
  const vestingVault = await deployVestingVault({
    signer,
    votingTokenAddress: votingToken.address,
    timelockAddress: timelock.address,
    // 300k blocks ~ 1 week on goerli
    staleBlockLag: 300_000,
  });

  const coreVoting = await deployCoreVoting({
    signer,
    timelockAddress: timelock.address,
    gscCoreVotingAddress: gscCoreVoting.address,
    votingVaultAddresses: [lockingVaultProxy.address, vestingVault.address],
    // set quorum to 50 ELFI so any test account can pass a vote
    baseQuorum: "50",
    // set minProposalPower to 50 ELFI so any test account can make a proposal
    minProposalPower: "50",
    // can execute a proposal 10 blocks after it gets created
    lockDuration: 10,
    // can vote on a proposal up to 300k blocks ~ 1 week on goerli
    extraVotingTime: 300000,
  });

  const gscVault = await deployGSCVault({
    signer,
    ownerAddress: timelock.address,
    // GSC vault depends on core voting contract to prove that members meet the
    // voting power minimum to be on the GSC.
    coreVotingAddress: coreVoting.address,
    // any test account can get onto GSC with this much vote power
    votingPowerBound: "100",
    // members are idle for 60 seconds after they join the GSC
    idleDuration: 60,
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
  return [
    coreVoting,
    votingToken,
    gscCoreVoting,
    gscVault,
    lockingVault,
    lockingVaultProxy,
    timelock,
    treasury,
    vestingVault,
  ];
}
