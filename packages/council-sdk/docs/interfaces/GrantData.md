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

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:269](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L269)

___

### delegate

• **delegate**: `string`

The address that can vote with this grant's voting power.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:300](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L300)

___

### expirationBlock

• **expirationBlock**: `number`

The block number of when the full allocation is vested and any
remaining balance can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:285](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L285)

___

### range

• **range**: [`string`, `string`]

The specific range of enumerated tokens in the vault that belong to this
grant. This is set when a grant is accepted with the `acceptGrant` method.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:306](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L306)

___

### startBlock

• **startBlock**: `number`

The block number of when the grant starts.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:279](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L279)

___

### unlockBlock

• **unlockBlock**: `number`

The block number after which any withdrawable tokens can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:290](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L290)

___

### votingPower

• **votingPower**: `string`

The voting power provided by the grant.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:295](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L295)

___

### withdrawn

• **withdrawn**: `string`

The amount of tokens that have been withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:274](https://github.com/element-fi/council-monorepo/blob/c567f01/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L274)
