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

- [execute](Proposal.md#execute)
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
- [getTargetsAndCalldatas](Proposal.md#gettargetsandcalldatas)
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

[packages/council-sdk/src/models/Proposal.ts:32](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L32)

## Properties

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### id

• **id**: `number`

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L23)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

___

### votingContract

• **votingContract**: [`VotingContract`](VotingContract.md)<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:24](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L24)

## Methods

### execute

▸ **execute**(`signer`, `options?`): `Promise`<`string`\>

Execute a proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:286](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L286)

___

### getCreatedBlock

▸ **getCreatedBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal was created. Will only be null
if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:105](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L105)

___

### getCreatedBy

▸ **getCreatedBy**(): `Promise`<``null`` \| `string`\>

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:119](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L119)

___

### getCreatedTransactionHash

▸ **getCreatedTransactionHash**(): `Promise`<``null`` \| `string`\>

Get the hash of the transaction that created the proposal, or null if
the Proposal doesn't exist.

#### Returns

`Promise`<``null`` \| `string`\>

The transaction hash

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:128](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L128)

___

### getCurrentQuorum

▸ **getCurrentQuorum**(): `Promise`<`string`\>

Get the current quorum of this proposal measured by summing the voting
power of all casted votes.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:249](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L249)

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

[packages/council-sdk/src/models/Proposal.ts:58](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L58)

___

### getExecutedTransactionHash

▸ **getExecutedTransactionHash**(): `Promise`<``null`` \| `string`\>

Get the hash of the transaction that executed the proposal, or null if
the Proposal wasn't executed.

#### Returns

`Promise`<``null`` \| `string`\>

The transaction hash

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:186](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L186)

___

### getExpirationBlock

▸ **getExpirationBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this voting ends for this proposal. Will only
be null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:138](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L138)

___

### getHash

▸ **getHash**(): `Promise`<``null`` \| `string`\>

Get the hash of this proposal, used by its voting contract to verify the
proposal data on execution. Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:85](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L85)

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

[packages/council-sdk/src/models/Proposal.ts:158](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L158)

___

### getIsExecutable

▸ **getIsExecutable**(): `Promise`<`boolean`\>

Get a boolean indicating whether this proposal can be executed. Proposals
can only be executed if the quorum requirement has been met, there are more
yes votes than no votes, and the current block is between the unlock and
last call blocks.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:260](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L260)

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

[packages/council-sdk/src/models/Proposal.ts:172](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L172)

___

### getLastCallBlock

▸ **getLastCallBlock**(): `Promise`<``null`` \| `number`\>

Get the block number after which this proposal can no longer be executed.
Not available on executed proposals.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:147](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L147)

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

[packages/council-sdk/src/models/Proposal.ts:96](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L96)

___

### getResults

▸ **getResults**(): `Promise`<[`VoteResults`](../modules.md#voteresults)\>

Get the total voting power of all votes on this proposal by their ballot.

#### Returns

`Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:241](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L241)

___

### getTargetsAndCalldatas

▸ **getTargetsAndCalldatas**(): `Promise`<``null`` \| [`Actions`](../interfaces/Actions.md)\>

Get the array of addresses that will be called (targets) and the data
they'll be called with (calldatas) by a proposal.

#### Returns

`Promise`<``null`` \| [`Actions`](../interfaces/Actions.md)\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:77](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L77)

___

### getUnlockBlock

▸ **getUnlockBlock**(): `Promise`<``null`` \| `number`\>

Get the block number of when this proposal can be executed. Will only be
null if this proposal instance was initiated with an invalid id.

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/models/Proposal.ts:114](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L114)

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

[packages/council-sdk/src/models/Proposal.ts:196](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L196)

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

[packages/council-sdk/src/models/Proposal.ts:215](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L215)

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

[packages/council-sdk/src/models/Proposal.ts:227](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L227)

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

[packages/council-sdk/src/models/Proposal.ts:300](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Proposal.ts#L300)
