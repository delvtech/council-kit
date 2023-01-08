[@council/sdk](../README.md) / [Exports](../modules.md) / VotingContract

# Class: VotingContract<TVaults\>

A model of a CoreVoting contract.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TVaults` | extends [`VotingVault`](VotingVault.md)[] = [`VotingVault`](VotingVault.md)[] |

## Hierarchy

- [`Model`](Model.md)

  ↳ **`VotingContract`**

  ↳↳ [`GSCVotingContract`](GSCVotingContract.md)

## Table of contents

### Constructors

- [constructor](VotingContract.md#constructor)

### Properties

- [address](VotingContract.md#address)
- [context](VotingContract.md#context)
- [dataSource](VotingContract.md#datasource)
- [name](VotingContract.md#name)
- [vaults](VotingContract.md#vaults)

### Methods

- [getParticipation](VotingContract.md#getparticipation)
- [getProposal](VotingContract.md#getproposal)
- [getProposals](VotingContract.md#getproposals)
- [getTotalVotingPower](VotingContract.md#gettotalvotingpower)
- [getVoters](VotingContract.md#getvoters)
- [getVotes](VotingContract.md#getvotes)
- [getVotingPower](VotingContract.md#getvotingpower)

## Constructors

### constructor

• **new VotingContract**<`TVaults`\>(`address`, `vaults`, `context`, `options?`)

Create a new VotingContract model instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TVaults` | extends [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[] = [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the deployed contract. |
| `vaults` | (`string` \| [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>)[] | The VotingVault instances or addresses of the vaults that are approved for this voting contract. |
| `context` | [`CouncilContext`](CouncilContext.md) | - |
| `options?` | [`VotingContractOptions`](../interfaces/VotingContractOptions.md) | - |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:42](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L42)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:32](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L32)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`VotingContractDataSource`](../interfaces/VotingContractDataSource.md)

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:33](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L33)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L20)

___

### vaults

• **vaults**: `TVaults`

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:34](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L34)

## Methods

### getParticipation

▸ **getParticipation**(`address`): `Promise`<[`number`, `number`]\>

Get the number of proposals an address has voted on and the number of
proposals that they were able to vote on. If the numbers are the same, then
the address has voted on every proposal they were able to.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`number`, `number`]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:161](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L161)

___

### getProposal

▸ **getProposal**(`id`): [`Proposal`](Proposal.md)

Get a proposal by id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`Proposal`](Proposal.md)

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:69](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L69)

___

### getProposals

▸ **getProposals**(`fromBlock?`, `toBlock?`): `Promise`<[`Proposal`](Proposal.md)[]\>

Get all proposals ever created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all proposals created on or after this block number. |
| `toBlock?` | `number` | Include all proposals created on or before this block number. |

#### Returns

`Promise`<[`Proposal`](Proposal.md)[]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:78](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L78)

___

### getTotalVotingPower

▸ **getTotalVotingPower**(`atBlock?`): `Promise`<`string`\>

Get the sum of voting power held by all voters in this voting contract.

#### Parameters

| Name | Type |
| :------ | :------ |
| `atBlock?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:89](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L89)

___

### getVoters

▸ **getVoters**(): `Promise`<[`Voter`](Voter.md)[]\>

Get all participants that have voting power in this voting contract.

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:119](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L119)

___

### getVotes

▸ **getVotes**(`address?`, `proposalId?`, `fromBlock?`, `toBlock?`): `Promise`<[`Vote`](Vote.md)[]\>

Get all casted votes on proposals in this voting contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | - |
| `proposalId?` | `number` | - |
| `fromBlock?` | `number` | The starting block number for the range of blocks fetched. |
| `toBlock?` | `number` | The ending block number for the range of blocks fetched. |

#### Returns

`Promise`<[`Vote`](Vote.md)[]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:132](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L132)

___

### getVotingPower

▸ **getVotingPower**(`address`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the voting power owned by a given address in this voting contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | - |
| `atBlock?` | `number` | - |
| `extraData?` | `BytesLike`[] | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:103](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L103)
