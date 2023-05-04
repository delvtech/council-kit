[@council/sdk](../README.md) / [Exports](../modules.md) / VotingVaultDataSource

# Interface: VotingVaultDataSource

An interface for fetching data from any voting vault.

## Hierarchy

- [`DataSource`](DataSource.md)

  ↳ **`VotingVaultDataSource`**

## Implemented by

- [`VotingVaultContractDataSource`](../classes/VotingVaultContractDataSource.md)

## Table of contents

### Properties

- [address](VotingVaultDataSource.md#address)
- [context](VotingVaultDataSource.md#context)
- [getVotingPower](VotingVaultDataSource.md#getvotingpower)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VotingVaultDataSource.ts:9](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VotingVaultDataSource.ts#L9)

___

### context

• **context**: [`CouncilContext`](../classes/CouncilContext.md)

#### Inherited from

[DataSource](DataSource.md).[context](DataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/DataSource.ts:8](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/DataSource.ts#L8)

___

### getVotingPower

• **getVotingPower**: (`address`: `string`, `atBlock?`: `number`, `extraData?`: `BytesLike`) => `Promise`<`string`\>

#### Type declaration

▸ (`address`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the voting power owned by a given address in this vault.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | - |
| `atBlock?` | `number` | - |
| `extraData?` | `BytesLike` | Abi encoded optional extra data used by some vaults, such as merkle proofs |

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VotingVaultDataSource.ts:16](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VotingVaultDataSource.ts#L16)
