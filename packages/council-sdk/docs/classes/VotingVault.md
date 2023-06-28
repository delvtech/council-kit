[@council/sdk](../README.md) / [Exports](../modules.md) / VotingVault

# Class: VotingVault<TDataSource\>

A vault which stores voting power by address

## Type parameters

| Name | Type |
| :------ | :------ |
| `TDataSource` | extends [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) = [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) |

## Hierarchy

- `IVotingVault`

- [`Model`](Model.md)

  ↳ **`VotingVault`**

  ↳↳ [`GSCVault`](GSCVault.md)

  ↳↳ [`LockingVault`](LockingVault.md)

  ↳↳ [`VestingVault`](VestingVault.md)

## Implements

- `IVotingVault`

## Table of contents

### Constructors

- [constructor](VotingVault.md#constructor)

### Properties

- [address](VotingVault.md#address)
- [context](VotingVault.md#context)
- [dataSource](VotingVault.md#datasource)
- [name](VotingVault.md#name)

### Methods

- [getTotalVotingPower](VotingVault.md#gettotalvotingpower)
- [getVoters](VotingVault.md#getvoters)
- [getVotingPower](VotingVault.md#getvotingpower)
- [getVotingPowerBreakdown](VotingVault.md#getvotingpowerbreakdown)

## Constructors

### constructor

• **new VotingVault**<`TDataSource`\>(`address`, `context`, `options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDataSource` | extends [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) = [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`VotingVaultOptions`](../interfaces/VotingVaultOptions.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\> |

#### Inherited from

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:59](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L59)

## Properties

### address

• **address**: `string`

#### Inherited from

IVotingVault.address

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:56](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L56)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: `TDataSource`

#### Inherited from

IVotingVault.dataSource

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:57](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L57)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### getTotalVotingPower

▸ `Optional` **getTotalVotingPower**(`atBlock?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `atBlock?` | `number` |

#### Returns

`Promise`<`string`\>

#### Inherited from

IVotingVault.getTotalVotingPower

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:38](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L38)

___

### getVoters

▸ `Optional` **getVoters**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromBlock?` | `number` |
| `toBlock?` | `number` |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Inherited from

IVotingVault.getVoters

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:32](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L32)

___

### getVotingPower

▸ **getVotingPower**(`address`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the usable voting power owned by a given address in this vault.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | - |
| `atBlock?` | `number` | `undefined` | - |
| `extraData` | `BytesLike` | `"0x00"` | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L83)

___

### getVotingPowerBreakdown

▸ `Optional` **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `fromBlock?` | `number` |
| `toBlock?` | `number` |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Inherited from

IVotingVault.getVotingPowerBreakdown

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:33](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L33)
