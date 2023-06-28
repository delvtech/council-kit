[@council/sdk](../README.md) / [Exports](../modules.md) / GSCVotingContract

# Class: GSCVotingContract

A model of a CoreVoting contract intended to be used by the Governance
Steering Council.

## Hierarchy

- [`VotingContract`](VotingContract.md)<[[`GSCVault`](GSCVault.md)]\>

  ↳ **`GSCVotingContract`**

## Table of contents

### Constructors

- [constructor](GSCVotingContract.md#constructor)

### Properties

- [address](GSCVotingContract.md#address)
- [context](GSCVotingContract.md#context)
- [dataSource](GSCVotingContract.md#datasource)
- [name](GSCVotingContract.md#name)
- [vaults](GSCVotingContract.md#vaults)

### Methods

- [createProposal](GSCVotingContract.md#createproposal)
- [getIdleDuration](GSCVotingContract.md#getidleduration)
- [getIsIdle](GSCVotingContract.md#getisidle)
- [getIsMember](GSCVotingContract.md#getismember)
- [getJoinDate](GSCVotingContract.md#getjoindate)
- [getMemberVaults](GSCVotingContract.md#getmembervaults)
- [getParticipation](GSCVotingContract.md#getparticipation)
- [getProposal](GSCVotingContract.md#getproposal)
- [getProposals](GSCVotingContract.md#getproposals)
- [getRequiredVotingPower](GSCVotingContract.md#getrequiredvotingpower)
- [getTotalVotingPower](GSCVotingContract.md#gettotalvotingpower)
- [getVoters](GSCVotingContract.md#getvoters)
- [getVotes](GSCVotingContract.md#getvotes)
- [getVotingPower](GSCVotingContract.md#getvotingpower)
- [getVotingPowerBreakdown](GSCVotingContract.md#getvotingpowerbreakdown)
- [join](GSCVotingContract.md#join)
- [kick](GSCVotingContract.md#kick)

## Constructors

### constructor

• **new GSCVotingContract**(`address`, `gscVault`, `context`, `options?`)

Create a new iGSCVotingContract model instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the deployed contract. |
| `gscVault` | `string` \| [`GSCVault`](GSCVault.md) | The GSCVault instance or address of the approved GSC vault. |
| `context` | [`CouncilContext`](CouncilContext.md) | - |
| `options?` | [`VotingContractOptions`](../interfaces/VotingContractOptions.md) | - |

#### Overrides

[VotingContract](VotingContract.md).[constructor](VotingContract.md#constructor)

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L20)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingContract](VotingContract.md).[address](VotingContract.md#address)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:41](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L41)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingContract](VotingContract.md).[context](VotingContract.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`VotingContractDataSource`](../interfaces/VotingContractDataSource.md)

#### Inherited from

[VotingContract](VotingContract.md).[dataSource](VotingContract.md#datasource)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:42](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L42)

___

### name

• **name**: `string`

#### Inherited from

[VotingContract](VotingContract.md).[name](VotingContract.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

___

### vaults

• **vaults**: [[`GSCVault`](GSCVault.md)]

#### Inherited from

[VotingContract](VotingContract.md).[vaults](VotingContract.md#vaults)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L43)

## Methods

### createProposal

▸ **createProposal**(`signer`, `vaults`, `targets`, `calldatas`, `lastCall`, `ballot`, `options?`): `Promise`<`string`\>

Create a new proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance for the voter. |
| `vaults` | (`string` \| [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>)[] | The addresses of the approved vaults to draw voting power from. |
| `targets` | `string`[] | The targets (contract addresses) to call. |
| `calldatas` | `BytesLike`[] | The calldatas to call each target with. |
| `lastCall` | `number` | - |
| `ballot` | [`Ballot`](../modules.md#ballot) | - |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Inherited from

[VotingContract](VotingContract.md).[createProposal](VotingContract.md#createproposal)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:106](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L106)

___

### getIdleDuration

▸ **getIdleDuration**(): `Promise`<`number`\>

Get the time (in MS) that a new GSC member must wait after joining before
they can vote.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:75](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L75)

___

### getIsIdle

▸ **getIsIdle**(`address`): `Promise`<`boolean`\>

Get a boolean indicating whether a member is still in the idle duration.
Idle members cannot vote.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L83)

___

### getIsMember

▸ **getIsMember**(`address`): `Promise`<`boolean`\>

Get a boolean indicating whether a given address is a current member.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:67](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L67)

___

### getJoinDate

▸ **getJoinDate**(`address`): `Promise`<``null`` \| `Date`\>

Get the join date of a given member.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null`` \| `Date`\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:60](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L60)

___

### getMemberVaults

▸ **getMemberVaults**(`address`): `Promise`<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

Get the voting vaults a member joined with. Used to prove the member meets
the minimum voting power requirement.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:91](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L91)

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

#### Inherited from

[VotingContract](VotingContract.md).[getParticipation](VotingContract.md#getparticipation)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:307](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L307)

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

#### Inherited from

[VotingContract](VotingContract.md).[getProposal](VotingContract.md#getproposal)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:78](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L78)

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

#### Inherited from

[VotingContract](VotingContract.md).[getProposals](VotingContract.md#getproposals)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:87](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L87)

___

### getRequiredVotingPower

▸ **getRequiredVotingPower**(): `Promise`<`string`\>

Get the amount of voting power required to join this voting contract.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:53](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L53)

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

#### Inherited from

[VotingContract](VotingContract.md).[getTotalVotingPower](VotingContract.md#gettotalvotingpower)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:137](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L137)

___

### getVoters

▸ **getVoters**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all participants that have voting power in this voting contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | The block number to start searching for voters from. |
| `toBlock?` | `number` | The block number to stop searching for voters at. |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Overrides

[VotingContract](VotingContract.md).[getVoters](VotingContract.md#getvoters)

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:46](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L46)

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

#### Inherited from

[VotingContract](VotingContract.md).[getVotes](VotingContract.md#getvotes)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:278](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L278)

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

#### Inherited from

[VotingContract](VotingContract.md).[getVotingPower](VotingContract.md#getvotingpower)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:149](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L149)

___

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

Get all participants that have voting power in this voting contract along
with their voting power, the amount of voting power being delegated to
them, and the amount of power delegated to them by each delegator. This is
a convenience method to fetch voting power and delegation data for a large
number of voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | Get a breakdown for a specific address. |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Inherited from

[VotingContract](VotingContract.md).[getVotingPowerBreakdown](VotingContract.md#getvotingpowerbreakdown)

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:185](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L185)

___

### join

▸ **join**(`signer`, `vaults`, `options?`): `Promise`<`string`\>

Become a member of this GSC voting contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the joining member. |
| `vaults` | `string`[] | The addresses of the approved vaults the joining member has voting power in. This is used to prove the joining member meets the minimum voting power requirement. If voting power is moved to a different vault, the member will become ineligible until they join again with the new vault or risk being kicked. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:105](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L105)

___

### kick

▸ **kick**(`signer`, `member`, `options?`): `Promise`<`string`\>

Remove a member that's become ineligible from this GSC vault. A member
becomes ineligible when the voting power in the vaults they joined with
drops below the required minimum.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet paying to kick. |
| `member` | `string` | The address of the ineligible member to kick. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingContract/GSCVotingContract.ts:126](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/GSCVotingContract.ts#L126)
