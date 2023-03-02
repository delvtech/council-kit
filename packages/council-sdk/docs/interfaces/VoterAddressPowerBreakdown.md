[@council/sdk](../README.md) / [Exports](../modules.md) / VoterAddressPowerBreakdown

# Interface: VoterAddressPowerBreakdown

## Hierarchy

- [`VoterAddressWithPower`](VoterAddressWithPower.md)

  ↳ **`VoterAddressPowerBreakdown`**

## Table of contents

### Properties

- [address](VoterAddressPowerBreakdown.md#address)
- [delegators](VoterAddressPowerBreakdown.md#delegators)
- [votingPower](VoterAddressPowerBreakdown.md#votingpower)
- [votingPowerFromDelegators](VoterAddressPowerBreakdown.md#votingpowerfromdelegators)

## Properties

### address

• **address**: `string`

#### Inherited from

[VoterAddressWithPower](VoterAddressWithPower.md).[address](VoterAddressWithPower.md#address)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:281](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L281)

___

### delegators

• **delegators**: [`VoterAddressWithPower`](VoterAddressWithPower.md)[]

All wallets delegated to this voter with the power they're delegating. Does
not include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:298](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L298)

___

### votingPower

• **votingPower**: `string`

#### Inherited from

[VoterAddressWithPower](VoterAddressWithPower.md).[votingPower](VoterAddressWithPower.md#votingpower)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:282](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L282)

___

### votingPowerFromDelegators

• **votingPowerFromDelegators**: `string`

The total voting power from all wallets delegated to this voter. Does not
include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:293](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L293)
