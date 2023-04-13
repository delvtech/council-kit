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

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:290](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L290)

___

### delegators

• **delegators**: [`VoterAddressWithPower`](VoterAddressWithPower.md)[]

All wallets delegated to this voter with the power they're delegating. Does
not include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:307](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L307)

___

### votingPower

• **votingPower**: `string`

#### Inherited from

[VoterAddressWithPower](VoterAddressWithPower.md).[votingPower](VoterAddressWithPower.md#votingpower)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:291](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L291)

___

### votingPowerFromDelegators

• **votingPowerFromDelegators**: `string`

The total voting power from all wallets delegated to this voter. Does not
include self-delegation.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:302](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L302)
