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

- [createProposal](VotingContract.md#createproposal)
- [getParticipation](VotingContract.md#getparticipation)
- [getProposal](VotingContract.md#getproposal)
- [getProposals](VotingContract.md#getproposals)
- [getTotalVotingPower](VotingContract.md#gettotalvotingpower)
- [getVoters](VotingContract.md#getvoters)
- [getVotes](VotingContract.md#getvotes)
- [getVotingPower](VotingContract.md#getvotingpower)
- [getVotingPowerBreakdown](VotingContract.md#getvotingpowerbreakdown)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:51](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L51)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:41](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L41)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`VotingContractDataSource`](../interfaces/VotingContractDataSource.md)

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:42](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L42)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/Model.ts#L20)

___

### vaults

• **vaults**: `TVaults`

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:43](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L43)

## Methods

### createProposal

▸ **createProposal**(`signer`, `vaults`, `targets`, `calldatas`, `lastCall`, `ballot`, `options?`): `Promise`<`string`\>

Create a new proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance for the voter. |
| `vaults` | `string`[] | The addresses of the approved vaults to draw voting power from. |
| `targets` | `string`[] | The targets (contract addresses) to call. |
| `calldatas` | `BytesLike`[] | The calldatas to call each target with. |
| `lastCall` | `number` | - |
| `ballot` | [`Ballot`](../modules.md#ballot) | - |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:106](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L106)

___

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:303](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L303)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:78](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L78)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:87](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L87)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:134](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L134)

___

### getVoters

▸ **getVoters**(): `Promise`<[`Voter`](Voter.md)[]\>

Get all participants that have voting power in this voting contract.

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:164](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L164)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:274](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L274)

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

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:148](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L148)

___

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

Get all participants that have voting power in this voting contract along
with their voting power, the amount of voting power being delegated to
them, and the amount of power delegated to them by each delegator. This is
a convenience method to fetch voting power and delegation data for a large
number of voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Defined in

[packages/council-sdk/src/models/VotingContract/VotingContract.ts:183](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/models/VotingContract/VotingContract.ts#L183)
