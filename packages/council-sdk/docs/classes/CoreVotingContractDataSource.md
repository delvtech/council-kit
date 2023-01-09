[@council/sdk](../README.md) / [Exports](../modules.md) / CoreVotingContractDataSource

# Class: CoreVotingContractDataSource

A DataSource with methods for making cached calls to a `CoreVoting` contract
from the Council protocol.

## Hierarchy

- [`ContractDataSource`](ContractDataSource.md)<`CoreVoting`\>

  ↳ **`CoreVotingContractDataSource`**

## Implements

- [`VotingContractDataSource`](../interfaces/VotingContractDataSource.md)

## Table of contents

### Constructors

- [constructor](CoreVotingContractDataSource.md#constructor)

### Properties

- [address](CoreVotingContractDataSource.md#address)
- [cache](CoreVotingContractDataSource.md#cache)
- [context](CoreVotingContractDataSource.md#context)
- [contract](CoreVotingContractDataSource.md#contract)

### Methods

- [cached](CoreVotingContractDataSource.md#cached)
- [call](CoreVotingContractDataSource.md#call)
- [callStatic](CoreVotingContractDataSource.md#callstatic)
- [callWithSigner](CoreVotingContractDataSource.md#callwithsigner)
- [clearCached](CoreVotingContractDataSource.md#clearcached)
- [deleteCached](CoreVotingContractDataSource.md#deletecached)
- [deleteCall](CoreVotingContractDataSource.md#deletecall)
- [getExecutedProposalIds](CoreVotingContractDataSource.md#getexecutedproposalids)
- [getProposal](CoreVotingContractDataSource.md#getproposal)
- [getProposalCount](CoreVotingContractDataSource.md#getproposalcount)
- [getProposals](CoreVotingContractDataSource.md#getproposals)
- [getResults](CoreVotingContractDataSource.md#getresults)
- [getVote](CoreVotingContractDataSource.md#getvote)
- [getVotes](CoreVotingContractDataSource.md#getvotes)
- [vote](CoreVotingContractDataSource.md#vote)

## Constructors

### constructor

• **new CoreVotingContractDataSource**(`address`, `context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |

#### Overrides

[ContractDataSource](ContractDataSource.md).[constructor](ContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:31](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L31)

## Properties

### address

• **address**: `string`

#### Implementation of

[VotingContractDataSource](../interfaces/VotingContractDataSource.md).[address](../interfaces/VotingContractDataSource.md#address)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[address](ContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:22](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cache](ContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:13](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[VotingContractDataSource](../interfaces/VotingContractDataSource.md).[context](../interfaces/VotingContractDataSource.md#context)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[context](ContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:12](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L12)

___

### contract

• **contract**: `CoreVoting`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[contract](ContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:23](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L23)

## Methods

### cached

▸ **cached**<`T`, `TKey`\>(`cacheKey`, `callback`): `ReturnType`<`T`\>

Cache the result of a callback using a given key.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends (...`args`: `any`) => `any` |
| `TKey` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheKey` | `TKey` | The key to use for the cache entry. The key will be reduced to a string. |
| `callback` | `T` | The function to be cached. The return type of the `cached` method will match the return type of this function. |

#### Returns

`ReturnType`<`T`\>

The cached result of the callback function.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cached](ContractDataSource.md#cached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:28](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L28)

___

### call

▸ **call**<`K`\>(`method`, `args`): `CoreVoting`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"DAY_IN_BLOCKS()"`` \| ``"approvedVaults(address)"`` \| ``"baseQuorum()"`` \| ``"changeExtraVotingTime(uint256)"`` \| ``"changeVaultStatus(address,bool)"`` \| ``"execute(uint256,address[],bytes[])"`` \| ``"extraVoteTime()"`` \| ``"getProposalVotingPower(uint256)"`` \| ``"lockDuration()"`` \| ``"minProposalPower()"`` \| ``"proposal(address[],bytes[],address[],bytes[],uint256,uint8)"`` \| ``"proposalCount()"`` \| ``"proposals(uint256)"`` \| ``"quorums(address,bytes4)"`` \| ``"setCustomQuorum(address,bytes4,uint256)"`` \| ``"setDefaultQuorum(uint256)"`` \| ``"setLockDuration(uint256)"`` \| ``"setMinProposalPower(uint256)"`` \| ``"vote(address[],bytes[],uint256,uint8)"`` \| ``"votes(address,uint256)"`` \| ``"DAY_IN_BLOCKS"`` \| ``"approvedVaults"`` \| ``"baseQuorum"`` \| ``"changeExtraVotingTime"`` \| ``"changeVaultStatus"`` \| ``"execute"`` \| ``"extraVoteTime"`` \| ``"getProposalVotingPower"`` \| ``"lockDuration"`` \| ``"minProposalPower"`` \| ``"proposal"`` \| ``"proposalCount"`` \| ``"proposals"`` \| ``"quorums"`` \| ``"setCustomQuorum"`` \| ``"setDefaultQuorum"`` \| ``"setLockDuration"`` \| ``"setMinProposalPower"`` \| ``"vote"`` \| ``"votes"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `CoreVoting`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`CoreVoting`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[call](ContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:43](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `DAY_IN_BLOCKS`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `DAY_IN_BLOCKS()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approvedVaults`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approvedVaults(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `baseQuorum`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `baseQuorum()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `changeExtraVotingTime`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeExtraVotingTime(uint256)`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus(address,bool)`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute(uint256,address[],bytes[])`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `extraVoteTime`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `extraVoteTime()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `getProposalVotingPower`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `getProposalVotingPower(uint256)`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `lockDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proposal`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposal(address[],bytes[],address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposalCount`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposalCount()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposals`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `proposals(uint256)`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `quorums`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `quorums(address,bytes4)`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCustomQuorum`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCustomQuorum(address,bytes4,uint256)`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum(uint256)`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration(uint256)`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower(uint256)`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `vote`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `vote(address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votes`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\> ; `votes(address,uint256)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"DAY_IN_BLOCKS()"`` \| ``"approvedVaults(address)"`` \| ``"baseQuorum()"`` \| ``"changeExtraVotingTime(uint256)"`` \| ``"changeVaultStatus(address,bool)"`` \| ``"execute(uint256,address[],bytes[])"`` \| ``"extraVoteTime()"`` \| ``"getProposalVotingPower(uint256)"`` \| ``"lockDuration()"`` \| ``"minProposalPower()"`` \| ``"proposal(address[],bytes[],address[],bytes[],uint256,uint8)"`` \| ``"proposalCount()"`` \| ``"proposals(uint256)"`` \| ``"quorums(address,bytes4)"`` \| ``"setCustomQuorum(address,bytes4,uint256)"`` \| ``"setDefaultQuorum(uint256)"`` \| ``"setLockDuration(uint256)"`` \| ``"setMinProposalPower(uint256)"`` \| ``"vote(address[],bytes[],uint256,uint8)"`` \| ``"votes(address,uint256)"`` \| ``"DAY_IN_BLOCKS"`` \| ``"approvedVaults"`` \| ``"baseQuorum"`` \| ``"changeExtraVotingTime"`` \| ``"changeVaultStatus"`` \| ``"execute"`` \| ``"extraVoteTime"`` \| ``"getProposalVotingPower"`` \| ``"lockDuration"`` \| ``"minProposalPower"`` \| ``"proposal"`` \| ``"proposalCount"`` \| ``"proposals"`` \| ``"quorums"`` \| ``"setCustomQuorum"`` \| ``"setDefaultQuorum"`` \| ``"setLockDuration"`` \| ``"setMinProposalPower"`` \| ``"vote"`` \| ``"votes"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `DAY_IN_BLOCKS`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `DAY_IN_BLOCKS()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approvedVaults`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approvedVaults(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `baseQuorum`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `baseQuorum()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `changeExtraVotingTime`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeExtraVotingTime(uint256)`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus(address,bool)`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute(uint256,address[],bytes[])`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `extraVoteTime`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `extraVoteTime()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `getProposalVotingPower`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `getProposalVotingPower(uint256)`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `lockDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proposal`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposal(address[],bytes[],address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposalCount`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposalCount()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposals`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `proposals(uint256)`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `quorums`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `quorums(address,bytes4)`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCustomQuorum`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCustomQuorum(address,bytes4,uint256)`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum(uint256)`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration(uint256)`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower(uint256)`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `vote`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `vote(address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votes`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\> ; `votes(address,uint256)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `DAY_IN_BLOCKS`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `DAY_IN_BLOCKS()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approvedVaults`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approvedVaults(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `baseQuorum`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `baseQuorum()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `changeExtraVotingTime`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeExtraVotingTime(uint256)`: (`_extraVoteTime`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeVaultStatus(address,bool)`: (`vault`: `PromiseOrValue`<`string`\>, `isValid`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `execute(uint256,address[],bytes[])`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `extraVoteTime`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `extraVoteTime()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `getProposalVotingPower`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `getProposalVotingPower(uint256)`: (`proposalId`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `BigNumber`, `BigNumber`]\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `lockDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `minProposalPower()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proposal`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposal(address[],bytes[],address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `targets`: `PromiseOrValue`<`string`\>[], `calldatas`: `PromiseOrValue`<`BytesLike`\>[], `lastCall`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proposalCount`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposalCount()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `proposals`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `proposals(uint256)`: (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & { `created`: `BigNumber` ; `expiration`: `BigNumber` ; `lastCall`: `BigNumber` ; `proposalHash`: `string` ; `quorum`: `BigNumber` ; `unlock`: `BigNumber`  }\> ; `quorums`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `quorums(address,bytes4)`: (`target`: `PromiseOrValue`<`string`\>, `functionSelector`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCustomQuorum`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCustomQuorum(address,bytes4,uint256)`: (`target`: `PromiseOrValue`<`string`\>, `selector`: `PromiseOrValue`<`BytesLike`\>, `quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setDefaultQuorum(uint256)`: (`quorum`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setLockDuration(uint256)`: (`_lockDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setMinProposalPower(uint256)`: (`_minProposalPower`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `vote`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `vote(address[],bytes[],uint256,uint8)`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraVaultData`: `PromiseOrValue`<`BytesLike`\>[], `proposalId`: `PromiseOrValue`<`BigNumberish`\>, `ballot`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votes`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\> ; `votes(address,uint256)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`, `number`] & { `castBallot`: `number` ; `votingPower`: `BigNumber`  }\>  }[`K`]\>

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callStatic](ContractDataSource.md#callstatic)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:62](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L62)

___

### callWithSigner

▸ **callWithSigner**<`K`\>(`method`, `args`, `signer`, `options?`): `Promise`<`ContractTransaction`\>

Call a write method on the contract with a signer and wait for the
transaction to resolve. If the transaction fails, this will throw an error.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"fallback"`` \| ``"authorize(address)"`` \| ``"deauthorize(address)"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"deauthorize"`` \| ``"setOwner"`` \| ``"changeExtraVotingTime(uint256)"`` \| ``"changeVaultStatus(address,bool)"`` \| ``"execute(uint256,address[],bytes[])"`` \| ``"proposal(address[],bytes[],address[],bytes[],uint256,uint8)"`` \| ``"setCustomQuorum(address,bytes4,uint256)"`` \| ``"setDefaultQuorum(uint256)"`` \| ``"setLockDuration(uint256)"`` \| ``"setMinProposalPower(uint256)"`` \| ``"vote(address[],bytes[],uint256,uint8)"`` \| ``"changeExtraVotingTime"`` \| ``"changeVaultStatus"`` \| ``"execute"`` \| ``"proposal"`` \| ``"setCustomQuorum"`` \| ``"setDefaultQuorum"`` \| ``"setLockDuration"`` \| ``"setMinProposalPower"`` \| ``"vote"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `CoreVoting`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
| `signer` | `Signer` | The Signer to connect to the contract with before calling. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`ContractTransaction`\>

A promise that resolves to the `ContractTransaction`.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callWithSigner](ContractDataSource.md#callwithsigner)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:83](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L83)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[clearCached](ContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:42](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L42)

___

### deleteCached

▸ **deleteCached**(`cacheKey?`): `boolean`

Delete a single entry from the cache.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheKey?` | `any` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCached](ContractDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:50](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"DAY_IN_BLOCKS()"`` \| ``"approvedVaults(address)"`` \| ``"baseQuorum()"`` \| ``"changeExtraVotingTime(uint256)"`` \| ``"changeVaultStatus(address,bool)"`` \| ``"execute(uint256,address[],bytes[])"`` \| ``"extraVoteTime()"`` \| ``"getProposalVotingPower(uint256)"`` \| ``"lockDuration()"`` \| ``"minProposalPower()"`` \| ``"proposal(address[],bytes[],address[],bytes[],uint256,uint8)"`` \| ``"proposalCount()"`` \| ``"proposals(uint256)"`` \| ``"quorums(address,bytes4)"`` \| ``"setCustomQuorum(address,bytes4,uint256)"`` \| ``"setDefaultQuorum(uint256)"`` \| ``"setLockDuration(uint256)"`` \| ``"setMinProposalPower(uint256)"`` \| ``"vote(address[],bytes[],uint256,uint8)"`` \| ``"votes(address,uint256)"`` \| ``"DAY_IN_BLOCKS"`` \| ``"approvedVaults"`` \| ``"baseQuorum"`` \| ``"changeExtraVotingTime"`` \| ``"changeVaultStatus"`` \| ``"execute"`` \| ``"extraVoteTime"`` \| ``"getProposalVotingPower"`` \| ``"lockDuration"`` \| ``"minProposalPower"`` \| ``"proposal"`` \| ``"proposalCount"`` \| ``"proposals"`` \| ``"quorums"`` \| ``"setCustomQuorum"`` \| ``"setDefaultQuorum"`` \| ``"setLockDuration"`` \| ``"setMinProposalPower"`` \| ``"vote"`` \| ``"votes"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `CoreVoting`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCall](ContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:131](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L131)

___

### getExecutedProposalIds

▸ **getExecutedProposalIds**(`fromBlock?`, `toBlock?`): `Promise`<`number`[]\>

Get the id of all executed proposals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all proposals executed on or after this block number. |
| `toBlock?` | `number` | Include all proposals executed on or before this block number. |

#### Returns

`Promise`<`number`[]\>

#### Implementation of

VotingContractDataSource.getExecutedProposalIds

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:77](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L77)

___

### getProposal

▸ **getProposal**(`id`): `Promise`<``null`` \| [`ProposalData`](../interfaces/ProposalData.md)\>

Get a proposal's `ProposalData` by `id` if it exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<``null`` \| [`ProposalData`](../interfaces/ProposalData.md)\>

#### Implementation of

VotingContractDataSource.getProposal

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:39](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L39)

___

### getProposalCount

▸ **getProposalCount**(): `Promise`<`number`\>

Get the total number of proposals created in this voting contract

#### Returns

`Promise`<`number`\>

#### Implementation of

VotingContractDataSource.getProposalCount

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:35](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L35)

___

### getProposals

▸ **getProposals**(`fromBlock?`, `toBlock?`): `Promise`<[`ProposalDataPreview`](../interfaces/ProposalDataPreview.md)[]\>

Get the `ProposalDataPreview` of all proposals ever created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all proposals created on or after this block number. |
| `toBlock?` | `number` | Include all proposals created on or before this block number. |

#### Returns

`Promise`<[`ProposalDataPreview`](../interfaces/ProposalDataPreview.md)[]\>

#### Implementation of

VotingContractDataSource.getProposals

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:55](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L55)

___

### getResults

▸ **getResults**(`proposalId`): `Promise`<[`VoteResults`](../modules.md#voteresults)\>

Get the total voting power of all votes on this proposal by their ballot.
Not available on executed proposals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `number` |

#### Returns

`Promise`<[`VoteResults`](../modules.md#voteresults)\>

#### Implementation of

VotingContractDataSource.getResults

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:137](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L137)

___

### getVote

▸ **getVote**(`address`, `proposalId`): `Promise`<``null`` \| [`VoteData`](../interfaces/VoteData.md)\>

Get a casted vote for a given address on
a given proposal id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `proposalId` | `number` |

#### Returns

`Promise`<``null`` \| [`VoteData`](../interfaces/VoteData.md)\>

#### Implementation of

VotingContractDataSource.getVote

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:95](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L95)

___

### getVotes

▸ **getVotes**(`address?`, `proposalId?`, `fromBlock?`, `toBlock?`): `Promise`<[`VoteData`](../interfaces/VoteData.md)[]\>

Get all casted votes on this proposal

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | - |
| `proposalId?` | `number` | - |
| `fromBlock?` | `number` | Include all votes casted on or after this block number. |
| `toBlock?` | `number` | Include all votes casted on or before this block number. |

#### Returns

`Promise`<[`VoteData`](../interfaces/VoteData.md)[]\>

#### Implementation of

VotingContractDataSource.getVotes

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:110](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L110)

___

### vote

▸ **vote**(`signer`, `vaults`, `proposalId`, `ballot`, `options?`): `Promise`<`string`\>

Vote on this proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | An ethers Signer instance for the voter. |
| `vaults` | `string`[] | The addresses of the approved vaults to draw voting power from. |
| `proposalId` | `number` | The id of the proposal to vote on. |
| `ballot` | [`Ballot`](../modules.md#ballot) | The ballot to cast. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Implementation of

VotingContractDataSource.vote

#### Defined in

[packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts:149](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingContract/CoreVotingContractDataSource.ts#L149)
