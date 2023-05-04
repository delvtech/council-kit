[@council/sdk](../README.md) / [Exports](../modules.md) / VoterPowerBreakdown

# Interface: VoterPowerBreakdown

## Hierarchy

- [`VoterAddressWithPower`](VoterAddressWithPower.md)

  ↳ **`VoterPowerBreakdown`**

## Table of contents

### Properties

- [address](VoterPowerBreakdown.md#address)
- [delegators](VoterPowerBreakdown.md#delegators)
- [votingPower](VoterPowerBreakdown.md#votingpower)
- [votingPowerFromDelegators](VoterPowerBreakdown.md#votingpowerfromdelegators)

## Properties

### address

• **address**: `string`

#### Inherited from

[VoterAddressWithPower](VoterAddressWithPower.md).[address](VoterAddressWithPower.md#address)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:292](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L292)

___

### delegators

• **delegators**: [`VoterAddressWithPower`](VoterAddressWithPower.md)[]

All wallets delegated to this voter with the power they're delegating. Does
not include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:309](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L309)

___

### votingPower

• **votingPower**: `string`

#### Inherited from

[VoterAddressWithPower](VoterAddressWithPower.md).[votingPower](VoterAddressWithPower.md#votingpower)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:293](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L293)

___

### votingPowerFromDelegators

• **votingPowerFromDelegators**: `string`

The total voting power from all wallets delegated to this voter. Does not
include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:304](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L304)
