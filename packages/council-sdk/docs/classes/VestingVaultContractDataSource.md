[@council/sdk](../README.md) / [Exports](../modules.md) / VestingVaultContractDataSource

# Class: VestingVaultContractDataSource

A DataSource with methods for making cached calls to a `VestingVault`
contract from the Council protocol.

## Hierarchy

- [`VotingVaultContractDataSource`](VotingVaultContractDataSource.md)<`VestingVault`\>

  ↳ **`VestingVaultContractDataSource`**

## Implements

- [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)

## Table of contents

### Constructors

- [constructor](VestingVaultContractDataSource.md#constructor)

### Properties

- [address](VestingVaultContractDataSource.md#address)
- [cache](VestingVaultContractDataSource.md#cache)
- [context](VestingVaultContractDataSource.md#context)
- [contract](VestingVaultContractDataSource.md#contract)

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
- [getGrant](VestingVaultContractDataSource.md#getgrant)
- [getHistoricalVotingPower](VestingVaultContractDataSource.md#gethistoricalvotingpower)
- [getStaleBlockLag](VestingVaultContractDataSource.md#getstaleblocklag)
- [getToken](VestingVaultContractDataSource.md#gettoken)
- [getUnvestedMultiplier](VestingVaultContractDataSource.md#getunvestedmultiplier)
- [getVoteChangeEvents](VestingVaultContractDataSource.md#getvotechangeevents)
- [getVotingPower](VestingVaultContractDataSource.md#getvotingpower)
- [getVotingPowerBreakdown](VestingVaultContractDataSource.md#getvotingpowerbreakdown)

## Constructors

### constructor

• **new VestingVaultContractDataSource**(`address`, `context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |

#### Overrides

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[constructor](VotingVaultContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:20](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L20)

## Properties

### address

• **address**: `string`

#### Implementation of

[VotingVaultDataSource](../interfaces/VotingVaultDataSource.md).[address](../interfaces/VotingVaultDataSource.md#address)

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[address](VotingVaultContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:22](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[cache](VotingVaultContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:13](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[VotingVaultDataSource](../interfaces/VotingVaultDataSource.md).[context](../interfaces/VotingVaultDataSource.md#context)

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[context](VotingVaultContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:12](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/CachedDataSource.ts#L12)

___

### contract

• **contract**: `VestingVault`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[contract](VotingVaultContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:23](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L23)

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

[packages/council-sdk/src/datasources/CachedDataSource.ts:28](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/CachedDataSource.ts#L28)

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
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:43](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L43)

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
| `K` | extends ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:62](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L62)

___

### callWithSigner

▸ **callWithSigner**<`K`\>(`method`, `args`, `signer`, `options?`): `Promise`<`ContractTransaction`\>

Call a write method on the contract with a signer and wait for the
transaction to resolve. If the transaction fails, this will throw an error.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"fallback"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:83](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L83)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:246](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L246)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:266](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L266)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[clearCached](VotingVaultContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:42](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/CachedDataSource.ts#L42)

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

[packages/council-sdk/src/datasources/CachedDataSource.ts:50](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"deposit"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"delegate"`` \| ``"acceptGrant"`` \| ``"acceptGrant()"`` \| ``"addGrantAndDelegate"`` \| ``"addGrantAndDelegate(address,uint128,uint128,uint128,uint128,address)"`` \| ``"changeUnvestedMultiplier"`` \| ``"changeUnvestedMultiplier(uint256)"`` \| ``"claim"`` \| ``"claim()"`` \| ``"delegate(address)"`` \| ``"deposit(uint256)"`` \| ``"getGrant"`` \| ``"getGrant(address)"`` \| ``"initialize"`` \| ``"initialize(address,address)"`` \| ``"manager"`` \| ``"manager()"`` \| ``"removeGrant"`` \| ``"removeGrant(address)"`` \| ``"setManager"`` \| ``"setManager(address)"`` \| ``"setTimelock"`` \| ``"setTimelock(address)"`` \| ``"timelock"`` \| ``"timelock()"`` \| ``"unvestedMultiplier"`` \| ``"unvestedMultiplier()"`` \| ``"updateVotingPower"`` \| ``"updateVotingPower(address)"`` \| ``"withdraw(uint256,address)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:131](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L131)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:71](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L71)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:79](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L79)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:45](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L45)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:122](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L122)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:113](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L113)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the associated token for this vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:27](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L27)

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

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:37](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L37)

___

### getVoteChangeEvents

▸ **getVoteChangeEvents**(`from?`, `to?`, `fromBlock?`, `toBlock?`): `Promise`<`VoteChangeEvent`[]\>

Get all emitted `VoteChange` events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from?` | `string` | The address that the voting power is coming from. |
| `to?` | `string` | The address that the voting power is going to. |
| `fromBlock?` | `number` | The block to start searching for events from. |
| `toBlock?` | `number` | The block to stop searching for events at. |

#### Returns

`Promise`<`VoteChangeEvent`[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:228](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L228)

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

#### Implementation of

VotingVaultDataSource.getVotingPower

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[getVotingPower](VotingVaultContractDataSource.md#getvotingpower)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts:44](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts#L44)

___

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`fromBlock?`, `toBlock?`): `Promise`<`VoterAddressPowerBreakdown`[]\>

Get the address of all participants that have voting power in this vault
along with their voting power, the amount of voting power being delegated
to them, and the amount of power delegated to them by each delegator. This
is a convenience method to fetch voting power and delegation data for a
large number of voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<`VoterAddressPowerBreakdown`[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts:156](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/VotingVault/VestingVaultContractDataSource.ts#L156)
