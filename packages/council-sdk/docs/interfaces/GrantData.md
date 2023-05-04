[@council/sdk](../README.md) / [Exports](../modules.md) / GrantData

# Interface: GrantData

A grant as it's stored in the contract.

## Table of contents

### Properties

- [allocation](GrantData.md#allocation)
- [delegate](GrantData.md#delegate)
- [expirationBlock](GrantData.md#expirationblock)
- [range](GrantData.md#range)
- [startBlock](GrantData.md#startblock)
- [unlockBlock](GrantData.md#unlockblock)
- [votingPower](GrantData.md#votingpower)
- [withdrawn](GrantData.md#withdrawn)

## Properties

### allocation

• **allocation**: `string`

The total amount of tokens granted.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:280](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L280)

___

### delegate

• **delegate**: `string`

The address that can vote with this grant's voting power.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:311](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L311)

___

### expirationBlock

• **expirationBlock**: `number`

The block number of when the full allocation is vested and any
remaining balance can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:296](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L296)

___

### range

• **range**: [`string`, `string`]

The specific range of enumerated tokens in the vault that belong to this
grant. This is set when a grant is accepted with the `acceptGrant` method.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:317](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L317)

___

### startBlock

• **startBlock**: `number`

The block number of when the grant starts.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:290](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L290)

___

### unlockBlock

• **unlockBlock**: `number`

The block number after which any withdrawable tokens can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:301](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L301)

___

### votingPower

• **votingPower**: `string`

The voting power provided by the grant.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:306](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L306)

___

### withdrawn

• **withdrawn**: `string`

The amount of tokens that have been withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:285](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L285)
