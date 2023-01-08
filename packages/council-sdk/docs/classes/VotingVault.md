[@council/sdk](../README.md) / [Exports](../modules.md) / VotingVault

# Class: VotingVault<TDataSource\>

A vault which stores voting power by address

## Type parameters

| Name | Type |
| :------ | :------ |
| `TDataSource` | extends [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) = [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md) |

## Hierarchy

- `VotingVaultModel`

- [`Model`](Model.md)

  ↳ **`VotingVault`**

  ↳↳ [`GSCVault`](GSCVault.md)

  ↳↳ [`LockingVault`](LockingVault.md)

  ↳↳ [`VestingVault`](VestingVault.md)

## Implements

- `VotingVaultModel`

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

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:50](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L50)

## Properties

### address

• **address**: `string`

#### Inherited from

VotingVaultModel.address

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:47](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L47)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: `TDataSource`

#### Inherited from

VotingVaultModel.dataSource

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:48](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L48)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### getTotalVotingPower

▸ `Optional` **getTotalVotingPower**(`...args`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`<`string`\>

#### Inherited from

VotingVaultModel.getTotalVotingPower

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:31](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L31)

___

### getVoters

▸ `Optional` **getVoters**(`...args`): `Promise`<[`Voter`](Voter.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Inherited from

VotingVaultModel.getVoters

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:30](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L30)

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

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:74](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L74)
