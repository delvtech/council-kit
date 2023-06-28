[@council/sdk](../README.md) / [Exports](../modules.md) / GSCVaultContractDataSource

# Class: GSCVaultContractDataSource

A DataSource with methods for making cached calls to a `GSCVault` contract
from the Council protocol.

## Hierarchy

- [`VotingVaultContractDataSource`](VotingVaultContractDataSource.md)<`GSCVault`\>

  ↳ **`GSCVaultContractDataSource`**

## Table of contents

### Constructors

- [constructor](GSCVaultContractDataSource.md#constructor)

### Properties

- [address](GSCVaultContractDataSource.md#address)
- [cache](GSCVaultContractDataSource.md#cache)
- [context](GSCVaultContractDataSource.md#context)
- [contract](GSCVaultContractDataSource.md#contract)
- [type](GSCVaultContractDataSource.md#type)
- [type](GSCVaultContractDataSource.md#type-1)

### Methods

- [cached](GSCVaultContractDataSource.md#cached)
- [call](GSCVaultContractDataSource.md#call)
- [callStatic](GSCVaultContractDataSource.md#callstatic)
- [callWithSigner](GSCVaultContractDataSource.md#callwithsigner)
- [clearCached](GSCVaultContractDataSource.md#clearcached)
- [deleteCached](GSCVaultContractDataSource.md#deletecached)
- [deleteCall](GSCVaultContractDataSource.md#deletecall)
- [getEvents](GSCVaultContractDataSource.md#getevents)
- [getIdleDuration](GSCVaultContractDataSource.md#getidleduration)
- [getJoinTimestamp](GSCVaultContractDataSource.md#getjointimestamp)
- [getMemberVaults](GSCVaultContractDataSource.md#getmembervaults)
- [getMembers](GSCVaultContractDataSource.md#getmembers)
- [getRequiredVotingPower](GSCVaultContractDataSource.md#getrequiredvotingpower)
- [getVotingPower](GSCVaultContractDataSource.md#getvotingpower)
- [join](GSCVaultContractDataSource.md#join)
- [kick](GSCVaultContractDataSource.md#kick)

## Constructors

### constructor

• **new GSCVaultContractDataSource**(`address`, `context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |

#### Overrides

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[constructor](VotingVaultContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L23)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[address](VotingVaultContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[cache](VotingVaultContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[context](VotingVaultContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L12)

___

### contract

• **contract**: `GSCVault`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[contract](VotingVaultContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L23)

___

### type

• **type**: `string` = `TYPE`

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:21](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L21)

___

### type

▪ `Static` **type**: `string` = `TYPE`

A field that can be used for more specific filtering when registering an
instance of this data source with the council context.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L20)

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

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[cached](VotingVaultContractDataSource.md#cached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L28)

___

### call

▸ **call**<`K`\>(`method`, `args`): `GSCVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"coreVoting()"`` \| ``"getUserVaults(address)"`` \| ``"idleDuration()"`` \| ``"kick(address,bytes[])"`` \| ``"members(address)"`` \| ``"proveMembership(address[],bytes[])"`` \| ``"setCoreVoting(address)"`` \| ``"setIdleDuration(uint256)"`` \| ``"setVotePowerBound(uint256)"`` \| ``"votingPowerBound()"`` \| ``"coreVoting"`` \| ``"getUserVaults"`` \| ``"idleDuration"`` \| ``"kick"`` \| ``"members"`` \| ``"proveMembership"`` \| ``"setCoreVoting"`` \| ``"setIdleDuration"`` \| ``"setVotePowerBound"`` \| ``"votingPowerBound"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `GSCVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`GSCVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[call](VotingVaultContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `coreVoting`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `coreVoting()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getUserVaults`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `getUserVaults(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `idleDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `idleDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `kick`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `kick(address,bytes[])`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `members`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `members(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proveMembership`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proveMembership(address[],bytes[])`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `queryVotePower`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCoreVoting`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCoreVoting(address)`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration(uint256)`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound(uint256)`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `votingPowerBound`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votingPowerBound()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"coreVoting()"`` \| ``"getUserVaults(address)"`` \| ``"idleDuration()"`` \| ``"kick(address,bytes[])"`` \| ``"members(address)"`` \| ``"proveMembership(address[],bytes[])"`` \| ``"setCoreVoting(address)"`` \| ``"setIdleDuration(uint256)"`` \| ``"setVotePowerBound(uint256)"`` \| ``"votingPowerBound()"`` \| ``"coreVoting"`` \| ``"getUserVaults"`` \| ``"idleDuration"`` \| ``"kick"`` \| ``"members"`` \| ``"proveMembership"`` \| ``"setCoreVoting"`` \| ``"setIdleDuration"`` \| ``"setVotePowerBound"`` \| ``"votingPowerBound"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `coreVoting`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `coreVoting()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getUserVaults`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `getUserVaults(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `idleDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `idleDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `kick`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `kick(address,bytes[])`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `members`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `members(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proveMembership`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proveMembership(address[],bytes[])`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `queryVotePower`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCoreVoting`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCoreVoting(address)`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration(uint256)`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound(uint256)`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `votingPowerBound`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votingPowerBound()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `coreVoting`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `coreVoting()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getUserVaults`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `getUserVaults(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`[]\> ; `idleDuration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `idleDuration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `kick`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `kick(address,bytes[])`: (`who`: `PromiseOrValue`<`string`\>, `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `members`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `members(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `proveMembership`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `proveMembership(address[],bytes[])`: (`votingVaults`: `PromiseOrValue`<`string`\>[], `extraData`: `PromiseOrValue`<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `queryVotePower`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`who`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `setCoreVoting`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setCoreVoting(address)`: (`_newVoting`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setIdleDuration(uint256)`: (`_idleDuration`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setVotePowerBound(uint256)`: (`_newBound`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `votingPowerBound`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `votingPowerBound()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>  }[`K`]\>

The value returned from the contract.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[callStatic](VotingVaultContractDataSource.md#callstatic)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:62](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L62)

___

### callWithSigner

▸ **callWithSigner**<`K`\>(`method`, `args`, `signer`, `options?`): `Promise`<`ContractTransaction`\>

Call a write method on the contract with a signer and wait for the
transaction to resolve. If the transaction fails, this will throw an error.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"fallback"`` \| ``"authorize(address)"`` \| ``"deauthorize(address)"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"deauthorize"`` \| ``"setOwner"`` \| ``"kick(address,bytes[])"`` \| ``"proveMembership(address[],bytes[])"`` \| ``"setCoreVoting(address)"`` \| ``"setIdleDuration(uint256)"`` \| ``"setVotePowerBound(uint256)"`` \| ``"kick"`` \| ``"proveMembership"`` \| ``"setCoreVoting"`` \| ``"setIdleDuration"`` \| ``"setVotePowerBound"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `GSCVault`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
| `signer` | `Signer` | The Signer to connect to the contract with before calling. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`ContractTransaction`\>

A promise that resolves to the `ContractTransaction`.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[callWithSigner](VotingVaultContractDataSource.md#callwithsigner)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L83)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[clearCached](VotingVaultContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:42](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L42)

___

### deleteCached

▸ **deleteCached**(`cacheKey`): `boolean`

Delete a single entry from the cache.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheKey` | `any` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[deleteCached](VotingVaultContractDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"coreVoting()"`` \| ``"getUserVaults(address)"`` \| ``"idleDuration()"`` \| ``"kick(address,bytes[])"`` \| ``"members(address)"`` \| ``"proveMembership(address[],bytes[])"`` \| ``"setCoreVoting(address)"`` \| ``"setIdleDuration(uint256)"`` \| ``"setVotePowerBound(uint256)"`` \| ``"votingPowerBound()"`` \| ``"coreVoting"`` \| ``"getUserVaults"`` \| ``"idleDuration"`` \| ``"kick"`` \| ``"members"`` \| ``"proveMembership"`` \| ``"setCoreVoting"`` \| ``"setIdleDuration"`` \| ``"setVotePowerBound"`` \| ``"votingPowerBound"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `GSCVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[deleteCall](VotingVaultContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L131)

___

### getEvents

▸ **getEvents**<`TEvent`\>(`filter`, `fromBlock?`, `toBlock?`): `Promise`<`TEvent`[]\>

Get events from the contract and cache the results with a key made from the
filter and block range. If the request fails, the block range will be split
in 2 recursively until all events within the requested range are fetched.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `TypedEventFilter`<`TEvent`\> | The TypedEventFilter of the event to fetch. |
| `fromBlock?` | `number` | Include all events on or after this block. |
| `toBlock?` | `number` | Include all events on or before this block. |

#### Returns

`Promise`<`TEvent`[]\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[getEvents](VotingVaultContractDataSource.md#getevents)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:146](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L146)

___

### getIdleDuration

▸ **getIdleDuration**(): `Promise`<`number`\>

Get the time (in MS) that a new GSC member must wait after joining before
they can vote.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:39](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L39)

___

### getJoinTimestamp

▸ **getJoinTimestamp**(`address`): `Promise`<``null`` \| `number`\>

Get a timestamp (in MS) of the join date of a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:101](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L101)

___

### getMemberVaults

▸ **getMemberVaults**(`address`): `Promise`<`string`[]\>

Get the voting vaults a member joined with. Used to prove the member meets
the minimum voting power requirement.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:111](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L111)

___

### getMembers

▸ **getMembers**(`fromBlock?`, `toBlock?`): `Promise`<`string`[]\>

Get the addresses of all current members of this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | The block number to start searching for members from. |
| `toBlock?` | `number` | The block number to stop searching for members at. |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:49](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L49)

___

### getRequiredVotingPower

▸ **getRequiredVotingPower**(): `Promise`<`string`\>

Get the amount of voting power required to join this GSC vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:30](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L30)

___

### getVotingPower

▸ **getVotingPower**(`this`, `address`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the voting power owned by a given address in this vault. Returns "0" if
the voting power is unable to be fetched.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`ContractDataSource`](ContractDataSource.md)<`IVotingVault`\> | `undefined` | - |
| `address` | `string` | `undefined` | - |
| `atBlock?` | `number` | `undefined` | - |
| `extraData` | `BytesLike` | `"0x00"` | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[getVotingPower](VotingVaultContractDataSource.md#getvotingpower)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VotingVaultContractDataSource.ts:44](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VotingVaultContractDataSource.ts#L44)

___

### join

▸ **join**(`signer`, `vaults`, `options?`): `Promise`<`string`\>

Become a member of this GSC vault.

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

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:125](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L125)

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

[packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts:153](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/GSCVaultContractDataSource.ts#L153)
