[@council/sdk](../README.md) / [Exports](../modules.md) / VestingVaultContractDataSource

# Class: VestingVaultContractDataSource

A DataSource with methods for making cached calls to a `VestingVault`
contract from the Council protocol.

## Hierarchy

- [`VotingVaultContractDataSource`](VotingVaultContractDataSource.md)<`VestingVault`\>

  ↳ **`VestingVaultContractDataSource`**

## Table of contents

### Constructors

- [constructor](VestingVaultContractDataSource.md#constructor)

### Properties

- [address](VestingVaultContractDataSource.md#address)
- [cache](VestingVaultContractDataSource.md#cache)
- [context](VestingVaultContractDataSource.md#context)
- [contract](VestingVaultContractDataSource.md#contract)
- [type](VestingVaultContractDataSource.md#type)
- [type](VestingVaultContractDataSource.md#type-1)

### Methods

- [cached](VestingVaultContractDataSource.md#cached)
- [call](VestingVaultContractDataSource.md#call)
- [callStatic](VestingVaultContractDataSource.md#callstatic)
- [callWithSigner](VestingVaultContractDataSource.md#callwithsigner)
- [changeDelegate](VestingVaultContractDataSource.md#changedelegate)
- [claim](VestingVaultContractDataSource.md#claim)
- [clearCached](VestingVaultContractDataSource.md#clearcached)
- [deleteCached](VestingVaultContractDataSource.md#deletecached)
- [deleteCall](VestingVaultContractDataSource.md#deletecall)
- [getDelegate](VestingVaultContractDataSource.md#getdelegate)
- [getDelegatorsTo](VestingVaultContractDataSource.md#getdelegatorsto)
- [getEvents](VestingVaultContractDataSource.md#getevents)
- [getGrant](VestingVaultContractDataSource.md#getgrant)
- [getHistoricalVotingPower](VestingVaultContractDataSource.md#gethistoricalvotingpower)
- [getStaleBlockLag](VestingVaultContractDataSource.md#getstaleblocklag)
- [getToken](VestingVaultContractDataSource.md#gettoken)
- [getUnvestedMultiplier](VestingVaultContractDataSource.md#getunvestedmultiplier)
- [getVotingPower](VestingVaultContractDataSource.md#getvotingpower)
- [getVotingPowerBreakdown](VestingVaultContractDataSource.md#getvotingpowerbreakdown)

## Constructors

### constructor

• **new VestingVaultContractDataSource**(`vault`, `context`)

Create a new `VestingVaultContractDataSource` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | `string` \| `VestingVault` | A `VestingVault` instance from the `@council/typechain` package or the address of the vesting vault contract. |
| `context` | [`CouncilContext`](CouncilContext.md) | - |

#### Overrides

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[constructor](VotingVaultContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:29](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L29)

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

• **contract**: `VestingVault`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[contract](VotingVaultContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L23)

___

### type

• **type**: `string` = `TYPE`

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L22)

___

### type

▪ `Static` **type**: `string` = `TYPE`

A field that can be used for more specific filtering when registering an
instance of this data source with the council context.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:21](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L21)

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

▸ **call**<`K`\>(`method`, `args`): `VestingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"token()"`` \| ``"claim"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `VestingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`VestingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[call](VotingVaultContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `acceptGrant`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `acceptGrant()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier(uint256)`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate(address)`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(uint256)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `getGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `initialize`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `initialize(address,address)`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `manager`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `manager()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `removeGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `removeGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager(address)`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock(address)`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `timelock`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `timelock()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `unvestedMultiplier`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `unvestedMultiplier()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `updateVotingPower`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `updateVotingPower(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256,address)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"token()"`` \| ``"claim"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `acceptGrant`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `acceptGrant()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier(uint256)`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate(address)`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(uint256)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `getGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `initialize`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `initialize(address,address)`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `manager`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `manager()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `removeGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `removeGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager(address)`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock(address)`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `timelock`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `timelock()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `unvestedMultiplier`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `unvestedMultiplier()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `updateVotingPower`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `updateVotingPower(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256,address)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `acceptGrant`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `acceptGrant()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)`: (`_who`: `PromiseOrValue`<`string`\>, `_amount`: `PromiseOrValue`<`BigNumberish`\>, `_startTime`: `PromiseOrValue`<`BigNumberish`\>, `_expiration`: `PromiseOrValue`<`BigNumberish`\>, `_cliff`: `PromiseOrValue`<`BigNumberish`\>, `_delegatee`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeUnvestedMultiplier(uint256)`: (`_multiplier`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim()`: (`overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `delegate(address)`: (`_to`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(uint256)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `getGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `getGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`GrantStructOutput`\> ; `initialize`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `initialize(address,address)`: (`manager_`: `PromiseOrValue`<`string`\>, `timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `manager`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `manager()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `removeGrant`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `removeGrant(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setManager(address)`: (`manager_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setTimelock(address)`: (`timelock_`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `timelock`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `timelock()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `unvestedMultiplier`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `unvestedMultiplier()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `updateVotingPower`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `updateVotingPower(address)`: (`_who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256,address)`: (`_amount`: `PromiseOrValue`<`BigNumberish`\>, `_recipient`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`]\>

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
| `K` | extends ``"fallback"`` \| ``"claim"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `VestingVault`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
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

### changeDelegate

▸ **changeDelegate**(`signer`, `delegate`, `options?`): `Promise`<`string`\>

Change current delegate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the address delegating. |
| `delegate` | `string` | The address to delegate to. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:245](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L245)

___

### claim

▸ **claim**(`signer`, `options?`): `Promise`<`string`\>

Claim a grant and withdraw the tokens.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with a grant to claim. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:265](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L265)

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
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"token()"`` \| ``"claim"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `VestingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[deleteCall](VotingVaultContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L131)

___

### getDelegate

▸ **getDelegate**(`address`): `Promise`<`string`\>

Get the address of the current delegate of a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:84](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L84)

___

### getDelegatorsTo

▸ **getDelegatorsTo**(`address`, `atBlock?`): `Promise`<`VoterAddressWithPower`[]\>

Get the addresses of all voters delegated to a given address in this vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<`VoterAddressWithPower`[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:92](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L92)

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

### getGrant

▸ **getGrant**(`address`): `Promise`<[`GrantData`](../interfaces/GrantData.md)\>

Get the grant data for a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`GrantData`](../interfaces/GrantData.md)\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:58](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L58)

___

### getHistoricalVotingPower

▸ **getHistoricalVotingPower**(`address`, `atBlock?`): `Promise`<`string`\>

Get the voting power for a given address at a given block without
accounting for the stale block lag.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:135](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L135)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:126](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L126)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the associated token for this vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:40](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L40)

___

### getUnvestedMultiplier

▸ **getUnvestedMultiplier**(): `Promise`<`number`\>

Get this vault's unvested multiplier, a number that represents the voting
power of each unvested token as a percentage of a vested token. For example
if unvested tokens have 50% voting power compared to vested ones, this
value would be 50.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L50)

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

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

Get the address of all participants that have voting power in this vault
along with their voting power, the amount of voting power being delegated
to them, and the amount of power delegated to them by each delegator. This
is a convenience method to fetch voting power and delegation data for a
large number of voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | Get a breakdown for a specific address. |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts:170](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/VestingVaultContractDataSource.ts#L170)
