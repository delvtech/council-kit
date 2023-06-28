[@council/sdk](README.md) / Exports

# @council/sdk

## Table of contents

### Classes

- [Airdrop](classes/Airdrop.md)
- [AirdropContractDataSource](classes/AirdropContractDataSource.md)
- [CachedDataSource](classes/CachedDataSource.md)
- [ContractDataSource](classes/ContractDataSource.md)
- [CoreVotingContractDataSource](classes/CoreVotingContractDataSource.md)
- [CouncilContext](classes/CouncilContext.md)
- [ERC20ContractDataSource](classes/ERC20ContractDataSource.md)
- [GSCVault](classes/GSCVault.md)
- [GSCVaultContractDataSource](classes/GSCVaultContractDataSource.md)
- [GSCVotingContract](classes/GSCVotingContract.md)
- [HTTPDataSource](classes/HTTPDataSource.md)
- [LockingVault](classes/LockingVault.md)
- [LockingVaultContractDataSource](classes/LockingVaultContractDataSource.md)
- [Model](classes/Model.md)
- [Proposal](classes/Proposal.md)
- [Token](classes/Token.md)
- [VestingVault](classes/VestingVault.md)
- [VestingVaultContractDataSource](classes/VestingVaultContractDataSource.md)
- [Vote](classes/Vote.md)
- [Voter](classes/Voter.md)
- [VotingContract](classes/VotingContract.md)
- [VotingVault](classes/VotingVault.md)
- [VotingVaultContractDataSource](classes/VotingVaultContractDataSource.md)

### Interfaces

- [Actions](interfaces/Actions.md)
- [AirdropContractDataSourceOptions](interfaces/AirdropContractDataSourceOptions.md)
- [AirdropDataSource](interfaces/AirdropDataSource.md)
- [AirdropOptions](interfaces/AirdropOptions.md)
- [CouncilContextOptions](interfaces/CouncilContextOptions.md)
- [DataSource](interfaces/DataSource.md)
- [GSCVaultOptions](interfaces/GSCVaultOptions.md)
- [GetBlockDateOptions](interfaces/GetBlockDateOptions.md)
- [GrantData](interfaces/GrantData.md)
- [LockingVaultOptions](interfaces/LockingVaultOptions.md)
- [ModelOptions](interfaces/ModelOptions.md)
- [ProposalData](interfaces/ProposalData.md)
- [ProposalDataPreview](interfaces/ProposalDataPreview.md)
- [TokenDataSource](interfaces/TokenDataSource.md)
- [TokenOptions](interfaces/TokenOptions.md)
- [TransactionOptions](interfaces/TransactionOptions.md)
- [TransactionReplacedError](interfaces/TransactionReplacedError.md)
- [VestingVaultOptions](interfaces/VestingVaultOptions.md)
- [VoteData](interfaces/VoteData.md)
- [VoterAddressWithPower](interfaces/VoterAddressWithPower.md)
- [VoterPowerBreakdown](interfaces/VoterPowerBreakdown.md)
- [VoterWithPower](interfaces/VoterWithPower.md)
- [VotingContractDataSource](interfaces/VotingContractDataSource.md)
- [VotingContractOptions](interfaces/VotingContractOptions.md)
- [VotingVaultDataSource](interfaces/VotingVaultDataSource.md)
- [VotingVaultOptions](interfaces/VotingVaultOptions.md)

### Type Aliases

- [AnyFunction](modules.md#anyfunction)
- [Ballot](modules.md#ballot)
- [FunctionKeys](modules.md#functionkeys)
- [GetAndSetOptions](modules.md#getandsetoptions)
- [TransactionFunction](modules.md#transactionfunction)
- [TransactionKeys](modules.md#transactionkeys)
- [VoteResults](modules.md#voteresults)

### Functions

- [cached](modules.md#cached)
- [cachedKey](modules.md#cachedkey)
- [getBlockDate](modules.md#getblockdate)
- [getVaultsWithPower](modules.md#getvaultswithpower)
- [sumStrings](modules.md#sumstrings)

## Data Sources

### Ballot

Ƭ **Ballot**: ``"yes"`` \| ``"no"`` \| ``"maybe"``

A valid ballot option.

#### Defined in

[packages/council-sdk/src/datasources/votingContract/VotingContractDataSource.ts:176](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingContract/VotingContractDataSource.ts#L176)

___

### FunctionKeys

Ƭ **FunctionKeys**<`T`\>: `Exclude`<{ [K in keyof T]: T[K] extends AnyFunction ? K : undefined }[keyof `T`], `undefined`\>

Get a union of all keys/properties on T that are functions.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:209](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L209)

___

### TransactionKeys

Ƭ **TransactionKeys**<`T`\>: `Exclude`<{ [K in keyof T]: T[K] extends TransactionFunction ? K : undefined }[keyof `T`], `undefined`\>

Get a union of all keys/properties on T that are functions and return a
`ContractTransaction`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:225](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L225)

___

### VoteResults

Ƭ **VoteResults**: `Record`<[`Ballot`](modules.md#ballot), `string`\>

The amount of voting power casted by ballot.

#### Defined in

[packages/council-sdk/src/datasources/votingContract/VotingContractDataSource.ts:193](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingContract/VotingContractDataSource.ts#L193)

## Utils

### cached

▸ **cached**<`TCallback`\>(`options`): `ReturnType`<`TCallback`\>

A utility for wrapping a callback with caching logic.

**`See`**

https://github.com/isaacs/node-lru-cache

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TCallback` | extends (...`args`: `any`[]) => `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` |  |
| `options.cache?` | `LRUCache`<`string`, `any`\> | An optional `lru-cache` instance to use for the callback's result. A new instance with `max: 500` is created by default. |
| `options.cacheKey` | `any` | The value to stringify and use to identify the cached result. |
| `options.callback` | `TCallback` | A function with a return value that will be cached and reused based on the cache's options. |
| `options.options?` | [`GetAndSetOptions`](modules.md#getandsetoptions) | LRUCache's `get` and `set` options merged. |

#### Returns

`ReturnType`<`TCallback`\>

The return value of the callback function.

#### Defined in

[packages/council-sdk/src/utils/cached.ts:21](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/cached.ts#L21)

___

### cachedKey

▸ **cachedKey**(`cacheKey`): `string`

Returns a key stringified in the same way as the `cached` utility.
This will not modify strings so
`cachedKey('foo') === cachedKey(cachedKey('foo'))`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheKey` | `any` | The value to stringify. |

#### Returns

`string`

#### Defined in

[packages/council-sdk/src/utils/cached.ts:51](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/cached.ts#L51)

___

### getBlockDate

▸ **getBlockDate**<`TEstimate`\>(`blockNumber`, `provider`, `options?`): `Promise`<`PossibleDate`<`TEstimate`\>\>

Get the date of a given block by it's block number

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEstimate` | extends `boolean` = ``false`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `number` |
| `provider` | `Provider` |
| `options?` | [`GetBlockDateOptions`](interfaces/GetBlockDateOptions.md)<`TEstimate`\> |

#### Returns

`Promise`<`PossibleDate`<`TEstimate`\>\>

#### Defined in

[packages/council-sdk/src/utils/getBlockDate.ts:30](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/getBlockDate.ts#L30)

___

### sumStrings

▸ **sumStrings**(`numberStrings`): `string`

Takes a group of numbers represented as strings and sums them together using
`ethers.BigNumber`.

**`See`**

https://docs.ethers.org/v5/api/utils/bignumber

#### Parameters

| Name | Type |
| :------ | :------ |
| `numberStrings` | `string`[] |

#### Returns

`string`

#### Defined in

[packages/council-sdk/src/utils/sumStrings.ts:9](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/sumStrings.ts#L9)

## Other

### AnyFunction

Ƭ **AnyFunction**: (...`args`: `any`) => `any`

#### Type declaration

▸ (`...args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

##### Returns

`any`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:203](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L203)

___

### GetAndSetOptions

Ƭ **GetAndSetOptions**: `Parameters`<`LRUCache`<`string`, `any`\>[``"get"``]\>[``1``] & `Parameters`<`LRUCache`<`string`, `any`\>[``"set"``]\>[``2``]

#### Defined in

[packages/council-sdk/src/utils/cached.ts:4](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/cached.ts#L4)

___

### TransactionFunction

Ƭ **TransactionFunction**: (...`args`: `any`) => `ContractTransaction` \| `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`...args`): `ContractTransaction` \| `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

##### Returns

`ContractTransaction` \| `Promise`<`ContractTransaction`\>

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:216](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L216)

___

### getVaultsWithPower

▸ **getVaultsWithPower**(`account`, `vaults`): `Promise`<[`VotingVault`](classes/VotingVault.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` |
| `vaults` | [`VotingVault`](classes/VotingVault.md)<[`VotingVaultDataSource`](interfaces/VotingVaultDataSource.md)\>[] |

#### Returns

`Promise`<[`VotingVault`](classes/VotingVault.md)[]\>

#### Defined in

[packages/council-sdk/src/utils/getVaultsWithPower.ts:3](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/getVaultsWithPower.ts#L3)
