[@council/sdk](../README.md) / [Exports](../modules.md) / Voter

# Class: Voter

A participant in Council

## Hierarchy

- [`Model`](Model.md)

  ↳ **`Voter`**

## Table of contents

### Constructors

- [constructor](Voter.md#constructor)

### Properties

- [address](Voter.md#address)
- [context](Voter.md#context)
- [name](Voter.md#name)

### Methods

- [getParticipation](Voter.md#getparticipation)
- [getVotes](Voter.md#getvotes)
- [getVotingPower](Voter.md#getvotingpower)

## Constructors

### constructor

• **new Voter**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`ModelOptions`](../interfaces/ModelOptions.md) |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/Voter.ts:16](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Voter.ts#L16)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/models/Voter.ts:14](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Voter.ts#L14)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### getParticipation

▸ **getParticipation**(`votingContractAddress`, `vaults`): `Promise`<[`number`, `number`]\>

Get the number of proposals this Voter has voted on and the number of
proposals that they were able to vote on. If the numbers are the same, then
this Voter has voted on every proposal they were able to.

#### Parameters

| Name | Type |
| :------ | :------ |
| `votingContractAddress` | `string` |
| `vaults` | (`string` \| [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>)[] |

#### Returns

`Promise`<[`number`, `number`]\>

#### Defined in

[packages/council-sdk/src/models/Voter.ts:61](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Voter.ts#L61)

___

### getVotes

▸ **getVotes**(`votingContractAddress`): `Promise`<[`Vote`](Vote.md)[]\>

Get the casted votes for this Voter in a given Voting Contract

#### Parameters

| Name | Type |
| :------ | :------ |
| `votingContractAddress` | `string` |

#### Returns

`Promise`<[`Vote`](Vote.md)[]\>

#### Defined in

[packages/council-sdk/src/models/Voter.ts:47](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Voter.ts#L47)

___

### getVotingPower

▸ **getVotingPower**(`vaults`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the total voting power for this Voter from a given list of vaults.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | (`string` \| [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>)[] | - |
| `atBlock?` | `number` | - |
| `extraData?` | `BytesLike`[] | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Voter.ts:30](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Voter.ts#L30)
