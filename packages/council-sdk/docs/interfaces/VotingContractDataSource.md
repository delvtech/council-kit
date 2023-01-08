[@council/sdk](../README.md) / [Exports](../modules.md) / VotingContractDataSource

# Interface: VotingContractDataSource

An interface for fetching data from any voting contract.

## Hierarchy

- [`DataSource`](DataSource.md)

  ↳ **`VotingContractDataSource`**

## Implemented by

- [`CoreVotingContractDataSource`](../classes/CoreVotingContractDataSource.md)

## Table of contents

### Properties

- [address](VotingContractDataSource.md#address)
- [context](VotingContractDataSource.md#context)
- [getExecutedProposalIds](VotingContractDataSource.md#getexecutedproposalids)
- [getProposal](VotingContractDataSource.md#getproposal)
- [getProposalCount](VotingContractDataSource.md#getproposalcount)
- [getProposals](VotingContractDataSource.md#getproposals)
- [getResults](VotingContractDataSource.md#getresults)
- [getVote](VotingContractDataSource.md#getvote)
- [getVotes](VotingContractDataSource.md#getvotes)
- [vote](VotingContractDataSource.md#vote)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:10](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L10)

___

### context

• **context**: [`CouncilContext`](../classes/CouncilContext.md)

#### Inherited from

[DataSource](DataSource.md).[context](DataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/DataSource.ts:8](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/DataSource.ts#L8)

___

### getExecutedProposalIds

• **getExecutedProposalIds**: (`fromBlock?`: `number`, `toBlock?`: `number`) => `Promise`<`number`[]\>

#### Type declaration

▸ (`fromBlock?`, `toBlock?`): `Promise`<`number`[]\>

Get the id of all executed proposals.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all proposals executed on or after this block number. |
| `toBlock?` | `number` | Include all proposals executed on or before this block number. |

##### Returns

`Promise`<`number`[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:38](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L38)

___

### getProposal

• **getProposal**: (`id`: `number`) => `Promise`<``null`` \| [`ProposalData`](ProposalData.md)\>

#### Type declaration

▸ (`id`): `Promise`<``null`` \| [`ProposalData`](ProposalData.md)\>

Get a proposal's `ProposalData` by `id` if it exists.

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

##### Returns

`Promise`<``null`` \| [`ProposalData`](ProposalData.md)\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:20](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L20)

___

### getProposalCount

• **getProposalCount**: () => `Promise`<`number`\>

#### Type declaration

▸ (): `Promise`<`number`\>

Get the total number of proposals created in this voting contract

##### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:15](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L15)

___

### getProposals

• **getProposals**: (`fromBlock?`: `number`, `toBlock?`: `number`) => `Promise`<[`ProposalDataPreview`](ProposalDataPreview.md)[]\>

#### Type declaration

▸ (`fromBlock?`, `toBlock?`): `Promise`<[`ProposalDataPreview`](ProposalDataPreview.md)[]\>

Get the `ProposalDataPreview` of all proposals ever created.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all proposals created on or after this block number. |
| `toBlock?` | `number` | Include all proposals created on or before this block number. |

##### Returns

`Promise`<[`ProposalDataPreview`](ProposalDataPreview.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:27](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L27)

___

### getResults

• **getResults**: (`proposalId`: `number`) => `Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Type declaration

▸ (`proposalId`): `Promise`<[`VoteResults`](../modules.md#voteresults)\>

Get the total voting power of all votes on this proposal by their ballot.
Not available on executed proposals.

##### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `number` |

##### Returns

`Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:65](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L65)

___

### getVote

• **getVote**: (`address`: `string`, `proposalId`: `number`) => `Promise`<``null`` \| [`VoteData`](VoteData.md)\>

#### Type declaration

▸ (`address`, `proposalId`): `Promise`<``null`` \| [`VoteData`](VoteData.md)\>

Get a casted vote for a given address on
a given proposal id.

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `proposalId` | `number` |

##### Returns

`Promise`<``null`` \| [`VoteData`](VoteData.md)\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:47](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L47)

___

### getVotes

• **getVotes**: (`address?`: `string`, `proposalId?`: `number`, `fromBlock?`: `number`, `toBlock?`: `number`) => `Promise`<[`VoteData`](VoteData.md)[]\>

#### Type declaration

▸ (`address?`, `proposalId?`, `fromBlock?`, `toBlock?`): `Promise`<[`VoteData`](VoteData.md)[]\>

Get all casted votes on this proposal

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | - |
| `proposalId?` | `number` | - |
| `fromBlock?` | `number` | Include all votes casted on or after this block number. |
| `toBlock?` | `number` | Include all votes casted on or before this block number. |

##### Returns

`Promise`<[`VoteData`](VoteData.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:54](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L54)

___

### vote

• **vote**: (`signer`: `Signer`, `vaults`: `string`[], `proposalId`: `number`, `ballot`: [`Ballot`](../modules.md#ballot), `options?`: [`TransactionOptions`](TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  }) => `Promise`<`string`\>

#### Type declaration

▸ (`signer`, `vaults`, `proposalId`, `ballot`, `options?`): `Promise`<`string`\>

Vote on this proposal.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance for the voter. |
| `vaults` | `string`[] | The addresses of the approved vaults to draw voting power from. |
| `proposalId` | `number` | The id of the proposal to vote on. |
| `ballot` | [`Ballot`](../modules.md#ballot) | The ballot to cast. |
| `options?` | [`TransactionOptions`](TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

##### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts:76](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/VotingContractDataSource.ts#L76)
