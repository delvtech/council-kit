[@council/sdk](../README.md) / [Exports](../modules.md) / Proposal

# Class: Proposal

A model of a Proposal in Council

## Hierarchy

- [`Model`](Model.md)

  ↳ **`Proposal`**

## Table of contents

### Constructors

- [constructor](Proposal.md#constructor)

### Properties

- [context](Proposal.md#context)
- [id](Proposal.md#id)
- [name](Proposal.md#name)
- [votingContract](Proposal.md#votingcontract)

### Methods

- [getCreatedBlock](Proposal.md#getcreatedblock)
- [getCurrentQuorum](Proposal.md#getcurrentquorum)
- [getData](Proposal.md#getdata)
- [getExpirationBlock](Proposal.md#getexpirationblock)
- [getHash](Proposal.md#gethash)
- [getIsActive](Proposal.md#getisactive)
- [getIsExecutable](Proposal.md#getisexecutable)
- [getIsExecuted](Proposal.md#getisexecuted)
- [getLastCallBlock](Proposal.md#getlastcallblock)
- [getRequiredQuorum](Proposal.md#getrequiredquorum)
- [getResults](Proposal.md#getresults)
- [getUnlockBlock](Proposal.md#getunlockblock)
- [getVote](Proposal.md#getvote)
- [getVotes](Proposal.md#getvotes)
- [getVotingPower](Proposal.md#getvotingpower)
- [vote](Proposal.md#vote)

## Constructors

### constructor

• **new Proposal**(`id`, `votingContract`, `context`, `options?`)

Create a new Proposal model instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | The id of the proposal in the voting contract. |
| `votingContract` | `string` \| [`VotingContract`](VotingContract.md)<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\> | the voting contract in which this proposal was created. |
| `context` | [`CouncilContext`](CouncilContext.md) | - |
| `options?` | [`ModelOptions`](../interfaces/ModelOptions.md) | - |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:29](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L29)

## Properties

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L19)

___

### id

• **id**: `number`

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:20](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L20)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L20)

___

### votingContract

• **votingContract**: [`VotingContract`](VotingContract.md)<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:21](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L21)

## Methods

### getCreatedBlock

▸ **getCreatedBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal was created. Will only be null
if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:93](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L93)

___

### getCurrentQuorum

▸ **getCurrentQuorum**(): `Promise`<`string`\>

Get the current quorum of this proposal measured by summing the voting
power of all casted votes.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:216](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L216)

___

### getData

▸ **getData**(): `Promise`<`Partial`<[`ProposalData`](../interfaces/ProposalData.md)\>\>

Get the base set of data returned from fetching a proposal. The data
returned will depend whether this proposal has been executed. Once
executed, the proposal is deleted from the voting contract and only a
preview of the data from the logs can be fetched.

Additionally, if this proposal instance was initiated with an invalid id,
then only the id provided will be available.

#### Returns

`Promise`<`Partial`<[`ProposalData`](../interfaces/ProposalData.md)\>\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:55](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L55)

___

### getExpirationBlock

▸ **getExpirationBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this voting ends for this proposal. Will only
be null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:111](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L111)

___

### getHash

▸ **getHash**(): `Promise`<``null`` \| `string`\>

Get the hash of this proposal, used by its voting contract to verify the
proposal data on execution. Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:74](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L74)

___

### getIsActive

▸ **getIsActive**(): `Promise`<`boolean`\>

Get a boolean indicating whether this proposal is still active. Proposals
are active during their voting period, i.e., from creation block up to
expiration block or execution. Returns false if the current block is later
than this proposal's expiration or this proposal has been executed.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:131](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L131)

___

### getIsExecutable

▸ **getIsExecutable**(): `Promise`<`boolean`\>

Get a boolean indicating whether this proposal can be executed. Proposals
can only be executed if the quorum requirement has been met and the current
block is between the unlock and last call blocks.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:226](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L226)

___

### getIsExecuted

▸ **getIsExecuted**(`atBlock?`): `Promise`<`boolean`\>

Get a boolean indicating whether this proposal has been executed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atBlock?` | `number` | The block number to check. If this proposal was executed on or before this block, this will return true. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:145](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L145)

___

### getLastCallBlock

▸ **getLastCallBlock**(): `Promise`<``null`` \| `number`\>

Get the block number after which this proposal can no longer be executed.
Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:120](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L120)

___

### getRequiredQuorum

▸ **getRequiredQuorum**(): `Promise`<``null`` \| `string`\>

Get the required quorum for this proposal to be executed, measured by
summing the voting power of all casted votes. Not available on executed
proposals.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:84](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L84)

___

### getResults

▸ **getResults**(): `Promise`<[`VoteResults`](../modules.md#voteresults)\>

Get the total voting power of all votes on this proposal by their ballot.
Not available on executed proposals.

#### Returns

`Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:208](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L208)

___

### getUnlockBlock

▸ **getUnlockBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal can be executed. Will only be
null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:102](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L102)

___

### getVote

▸ **getVote**(`address`): `Promise`<``null`` \| [`Vote`](Vote.md)\>

Get the casted vote for a given address on this proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address that casted the vote. |

#### Returns

`Promise`<``null`` \| [`Vote`](Vote.md)\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:158](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L158)

___

### getVotes

▸ **getVotes**(`fromBlock?`, `toBlock?`): `Promise`<[`Vote`](Vote.md)[]\>

Get all casted votes on this proposal

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all votes casted on or after this block number. |
| `toBlock?` | `number` | Include all votes casted on or before this block number. |

#### Returns

`Promise`<[`Vote`](Vote.md)[]\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:177](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L177)

___

### getVotingPower

▸ **getVotingPower**(`address`, `extraData?`): `Promise`<``null`` \| `string`\>

Get the usable voting power of a given address for this proposal determined
by its creation block. Any changes to voting power after the creation block
of this proposal will not be reflected.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | - |
| `extraData?` | `BytesLike`[] | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:193](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L193)

___

### vote

▸ **vote**(`signer`, `ballot`, `options?`): `Promise`<`string`\>

Vote on this proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance for the voter. |
| `ballot` | [`Ballot`](../modules.md#ballot) | The ballot to cast. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:247](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Proposal.ts#L247)
