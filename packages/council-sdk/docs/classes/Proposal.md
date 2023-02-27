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
- [getCreatedBy](Proposal.md#getcreatedby)
- [getCreatedTransactionHash](Proposal.md#getcreatedtransactionhash)
- [getCurrentQuorum](Proposal.md#getcurrentquorum)
- [getData](Proposal.md#getdata)
- [getExecutedTransactionHash](Proposal.md#getexecutedtransactionhash)
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

[packages/council-sdk/src/models/Proposal.ts:30](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L30)

## Properties

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Model.ts#L19)

___

### id

• **id**: `number`

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:21](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L21)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Model.ts#L20)

___

### votingContract

• **votingContract**: [`VotingContract`](VotingContract.md)<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:22](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L22)

## Methods

### getCreatedBlock

▸ **getCreatedBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal was created. Will only be null
if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:95](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L95)

___

### getCreatedBy

▸ **getCreatedBy**(): `Promise`<``null`` \| `string`\>

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:109](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L109)

___

### getCreatedTransactionHash

▸ **getCreatedTransactionHash**(): `Promise`<``null`` \| `string`\>

Get the hash of the transaction that created the proposal, or null if
the Proposal doesn't exist.

#### Returns

`Promise`<``null`` \| `string`\>

The transaction hash

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:118](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L118)

___

### getCurrentQuorum

▸ **getCurrentQuorum**(): `Promise`<`string`\>

Get the current quorum of this proposal measured by summing the voting
power of all casted votes.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:240](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L240)

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

[packages/council-sdk/src/models/Proposal.ts:56](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L56)

___

### getExecutedTransactionHash

▸ **getExecutedTransactionHash**(): `Promise`<``null`` \| `string`\>

Get the hash of the transaction that executed the proposal, or null if
the Proposal wasn't executed.

#### Returns

`Promise`<``null`` \| `string`\>

The transaction hash

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:176](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L176)

___

### getExpirationBlock

▸ **getExpirationBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this voting ends for this proposal. Will only
be null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:128](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L128)

___

### getHash

▸ **getHash**(): `Promise`<``null`` \| `string`\>

Get the hash of this proposal, used by its voting contract to verify the
proposal data on execution. Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:75](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L75)

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

[packages/council-sdk/src/models/Proposal.ts:148](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L148)

___

### getIsExecutable

▸ **getIsExecutable**(): `Promise`<`boolean`\>

Get a boolean indicating whether this proposal can be executed. Proposals
can only be executed if the quorum requirement has been met and the current
block is between the unlock and last call blocks.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:250](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L250)

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

[packages/council-sdk/src/models/Proposal.ts:162](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L162)

___

### getLastCallBlock

▸ **getLastCallBlock**(): `Promise`<``null`` \| `number`\>

Get the block number after which this proposal can no longer be executed.
Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:137](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L137)

___

### getRequiredQuorum

▸ **getRequiredQuorum**(): `Promise`<``null`` \| `string`\>

Get the required quorum for this proposal to be executed. If the sum of
voting power from all casted votes does not meet or exceed this number,
then the proposal is not passing quorum. Not available on executed
proposals.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:86](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L86)

___

### getResults

▸ **getResults**(): `Promise`<[`VoteResults`](../modules.md#voteresults)\>

Get the total voting power of all votes on this proposal by their ballot.
Not available on executed proposals.

#### Returns

`Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:232](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L232)

___

### getUnlockBlock

▸ **getUnlockBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal can be executed. Will only be
null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:104](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L104)

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

[packages/council-sdk/src/models/Proposal.ts:186](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L186)

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

[packages/council-sdk/src/models/Proposal.ts:205](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L205)

___

### getVotingPower

▸ **getVotingPower**(`address`, `extraData?`): `Promise`<``null`` \| `string`\>

Get the usable voting power of a given address for this proposal determined
by its creation block. Any changes to voting power after the creation block
of this proposal does not apply to this proposal and therefore will not be
reflected.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | - |
| `extraData?` | `BytesLike`[] | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:217](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L217)

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

[packages/council-sdk/src/models/Proposal.ts:271](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/models/Proposal.ts#L271)
