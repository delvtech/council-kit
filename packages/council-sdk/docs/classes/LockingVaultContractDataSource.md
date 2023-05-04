[@council/sdk](../README.md) / [Exports](../modules.md) / LockingVaultContractDataSource

# Class: LockingVaultContractDataSource

A DataSource with methods for making cached calls to a `LockingVault`
contract from the Council protocol.

## Hierarchy

- [`VotingVaultContractDataSource`](VotingVaultContractDataSource.md)<`LockingVault`\>

  ↳ **`LockingVaultContractDataSource`**

## Table of contents

### Constructors

- [constructor](LockingVaultContractDataSource.md#constructor)

### Properties

- [address](LockingVaultContractDataSource.md#address)
- [cache](LockingVaultContractDataSource.md#cache)
- [context](LockingVaultContractDataSource.md#context)
- [contract](LockingVaultContractDataSource.md#contract)
- [type](LockingVaultContractDataSource.md#type)
- [type](LockingVaultContractDataSource.md#type-1)

### Methods

- [cached](LockingVaultContractDataSource.md#cached)
- [call](LockingVaultContractDataSource.md#call)
- [callStatic](LockingVaultContractDataSource.md#callstatic)
- [callWithSigner](LockingVaultContractDataSource.md#callwithsigner)
- [changeDelegate](LockingVaultContractDataSource.md#changedelegate)
- [clearCached](LockingVaultContractDataSource.md#clearcached)
- [clearTokenCached](LockingVaultContractDataSource.md#cleartokencached)
- [deleteCached](LockingVaultContractDataSource.md#deletecached)
- [deleteCall](LockingVaultContractDataSource.md#deletecall)
- [deposit](LockingVaultContractDataSource.md#deposit)
- [getDelegate](LockingVaultContractDataSource.md#getdelegate)
- [getDelegatorsTo](LockingVaultContractDataSource.md#getdelegatorsto)
- [getDepositedBalance](LockingVaultContractDataSource.md#getdepositedbalance)
- [getEvents](LockingVaultContractDataSource.md#getevents)
- [getHistoricalVotingPower](LockingVaultContractDataSource.md#gethistoricalvotingpower)
- [getStaleBlockLag](LockingVaultContractDataSource.md#getstaleblocklag)
- [getToken](LockingVaultContractDataSource.md#gettoken)
- [getVotingPower](LockingVaultContractDataSource.md#getvotingpower)
- [getVotingPowerBreakdown](LockingVaultContractDataSource.md#getvotingpowerbreakdown)
- [withdraw](LockingVaultContractDataSource.md#withdraw)

## Constructors

### constructor

• **new LockingVaultContractDataSource**(`address`, `context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |

#### Overrides

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[constructor](VotingVaultContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:25](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L25)

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

• **contract**: `LockingVault`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[contract](VotingVaultContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L23)

___

### type

• **type**: `string` = `TYPE`

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L23)

___

### type

▪ `Static` **type**: `string` = `TYPE`

A field that can be used for more specific filtering when registering an
instance of this data source with the council context.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L22)

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

▸ **call**<`K`\>(`method`, `args`): `LockingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"token()"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `LockingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`LockingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[call](VotingVaultContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `changeDelegation`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeDelegation(address)`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(address,uint256,address)`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposits`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `deposits(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `withdraw`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"token()"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `changeDelegation`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeDelegation(address)`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(address,uint256,address)`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposits`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `deposits(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `withdraw`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `changeDelegation`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `changeDelegation(address)`: (`newDelegate`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposit(address,uint256,address)`: (`fundedAccount`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `firstDelegation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deposits`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `deposits(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`, `BigNumber`]\> ; `queryVotePower`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePower(address,uint256,bytes)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `arg2`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `queryVotePowerView(address,uint256)`: (`user`: `PromiseOrValue`<`string`\>, `blockNumber`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `staleBlockLag()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `withdraw`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `withdraw(uint256)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>  }[`K`]\>

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
| `K` | extends ``"fallback"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `LockingVault`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
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

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:210](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L210)

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

### clearTokenCached

▸ `Private` **clearTokenCached**(): `Promise`<`void`\>

Checks the `context` for a `TokenDataSource` for this vault's
token and clears the cache if it's a `CachedDataSource`.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:278](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L278)

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
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"token()"`` \| ``"token"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `LockingVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[deleteCall](VotingVaultContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L131)

___

### deposit

▸ **deposit**(`signer`, `account`, `amount`, `firstDelegate`, `options?`): `Promise`<`string`\>

Deposit tokens into this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with the tokens. |
| `account` | `string` | The address to credit this deposit to. |
| `amount` | `BigNumber` | A BigNumber of the amount of tokens to deposit. |
| `firstDelegate` | `string` | The address to delegate the resulting voting power to if the account doesn't already have a delegate. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:234](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L234)

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

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:49](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L49)

___

### getDelegatorsTo

▸ **getDelegatorsTo**(`address`, `atBlock?`): `Promise`<[`VoterAddressWithPower`](../interfaces/VoterAddressWithPower.md)[]\>

Get the addresses of all voters delegated to a given address in this vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<[`VoterAddressWithPower`](../interfaces/VoterAddressWithPower.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:57](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L57)

___

### getDepositedBalance

▸ **getDepositedBalance**(`address`): `Promise`<`string`\>

Get the amount of tokens that a given `address` has deposited into this
vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:41](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L41)

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

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:100](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L100)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:91](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L91)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the associated token for this vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:33](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L33)

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

▸ **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<[`VoterPowerBreakdown`](../interfaces/VoterPowerBreakdown.md)[]\>

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

`Promise`<[`VoterPowerBreakdown`](../interfaces/VoterPowerBreakdown.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:135](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L135)

___

### withdraw

▸ **withdraw**(`signer`, `amount`, `options?`): `Promise`<`string`\>

Withdraw tokens from this Locking Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with a deposited balance. |
| `amount` | `BigNumber` | A BigNumber of the amount of tokens to withdraw. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts:258](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/votingVault/LockingVaultContractDataSource.ts#L258)
