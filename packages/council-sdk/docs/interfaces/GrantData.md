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

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:278](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L278)

___

### delegate

• **delegate**: `string`

The address that can vote with this grant's voting power.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:309](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L309)

___

### expirationBlock

• **expirationBlock**: `number`

The block number of when the full allocation is vested and any
remaining balance can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:294](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L294)

___

### range

• **range**: [`string`, `string`]

The specific range of enumerated tokens in the vault that belong to this
grant. This is set when a grant is accepted with the `acceptGrant` method.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:315](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L315)

___

### startBlock

• **startBlock**: `number`

The block number of when the grant starts.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:288](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L288)

___

### unlockBlock

• **unlockBlock**: `number`

The block number after which any withdrawable tokens can be withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:299](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L299)

___

### votingPower

• **votingPower**: `string`

The voting power provided by the grant.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:304](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L304)

___

### withdrawn

• **withdrawn**: `string`

The amount of tokens that have been withdrawn.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:283](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L283)
