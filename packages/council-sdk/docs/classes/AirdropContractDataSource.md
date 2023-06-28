[@council/sdk](../README.md) / [Exports](../modules.md) / AirdropContractDataSource

# Class: AirdropContractDataSource

An interface for fetching data from any airdrop.

## Hierarchy

- [`ContractDataSource`](ContractDataSource.md)<`Airdrop`\>

  ↳ **`AirdropContractDataSource`**

## Implements

- [`AirdropDataSource`](../interfaces/AirdropDataSource.md)

## Table of contents

### Constructors

- [constructor](AirdropContractDataSource.md#constructor)

### Properties

- [address](AirdropContractDataSource.md#address)
- [cache](AirdropContractDataSource.md#cache)
- [context](AirdropContractDataSource.md#context)
- [contract](AirdropContractDataSource.md#contract)
- [tokenDataSourceGetter](AirdropContractDataSource.md#tokendatasourcegetter)

### Methods

- [cached](AirdropContractDataSource.md#cached)
- [call](AirdropContractDataSource.md#call)
- [callStatic](AirdropContractDataSource.md#callstatic)
- [callWithSigner](AirdropContractDataSource.md#callwithsigner)
- [claim](AirdropContractDataSource.md#claim)
- [claimAndDelegate](AirdropContractDataSource.md#claimanddelegate)
- [clearCached](AirdropContractDataSource.md#clearcached)
- [deleteCached](AirdropContractDataSource.md#deletecached)
- [deleteCall](AirdropContractDataSource.md#deletecall)
- [getClaimedAmount](AirdropContractDataSource.md#getclaimedamount)
- [getEvents](AirdropContractDataSource.md#getevents)
- [getExpiration](AirdropContractDataSource.md#getexpiration)
- [getLockingVault](AirdropContractDataSource.md#getlockingvault)
- [getMerkleRoot](AirdropContractDataSource.md#getmerkleroot)
- [getToken](AirdropContractDataSource.md#gettoken)
- [getTokenDecimals](AirdropContractDataSource.md#gettokendecimals)
- [reclaim](AirdropContractDataSource.md#reclaim)

## Constructors

### constructor

• **new AirdropContractDataSource**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`AirdropContractDataSourceOptions`](../interfaces/AirdropContractDataSourceOptions.md) |

#### Overrides

[ContractDataSource](ContractDataSource.md).[constructor](ContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:32](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L32)

## Properties

### address

• **address**: `string`

#### Implementation of

[AirdropDataSource](../interfaces/AirdropDataSource.md).[address](../interfaces/AirdropDataSource.md#address)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[address](ContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cache](ContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[AirdropDataSource](../interfaces/AirdropDataSource.md).[context](../interfaces/AirdropDataSource.md#context)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[context](ContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L12)

___

### contract

• **contract**: `Airdrop`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[contract](ContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L23)

___

### tokenDataSourceGetter

• `Private` **tokenDataSourceGetter**: `TokenDataSourceGetter`

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:30](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L30)

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

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L28)

___

### call

▸ **call**<`K`\>(`method`, `args`): `Airdrop`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"claim(uint256,uint256,bytes32[],address)"`` \| ``"claimAndDelegate(uint256,address,uint256,bytes32[],address)"`` \| ``"claimed(address)"`` \| ``"expiration()"`` \| ``"lockingVault()"`` \| ``"reclaim(address)"`` \| ``"rewardsRoot()"`` \| ``"token()"`` \| ``"claim"`` \| ``"claimAndDelegate"`` \| ``"claimed"`` \| ``"expiration"`` \| ``"lockingVault"`` \| ``"reclaim"`` \| ``"rewardsRoot"`` \| ``"token"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `Airdrop`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`Airdrop`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[call](ContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `claim`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim(uint256,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate(uint256,address,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimed`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `claimed(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `expiration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `expiration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockingVault`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `lockingVault()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `reclaim`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `reclaim(address)`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `rewardsRoot`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `rewardsRoot()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"claim(uint256,uint256,bytes32[],address)"`` \| ``"claimAndDelegate(uint256,address,uint256,bytes32[],address)"`` \| ``"claimed(address)"`` \| ``"expiration()"`` \| ``"lockingVault()"`` \| ``"reclaim(address)"`` \| ``"rewardsRoot()"`` \| ``"token()"`` \| ``"claim"`` \| ``"claimAndDelegate"`` \| ``"claimed"`` \| ``"expiration"`` \| ``"lockingVault"`` \| ``"reclaim"`` \| ``"rewardsRoot"`` \| ``"token"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `claim`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim(uint256,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate(uint256,address,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimed`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `claimed(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `expiration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `expiration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockingVault`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `lockingVault()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `reclaim`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `reclaim(address)`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `rewardsRoot`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `rewardsRoot()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `claim`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claim(uint256,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimAndDelegate(uint256,address,uint256,bytes32[],address)`: (`amount`: `PromiseOrValue`<`BigNumberish`\>, `delegate`: `PromiseOrValue`<`string`\>, `totalGrant`: `PromiseOrValue`<`BigNumberish`\>, `merkleProof`: `PromiseOrValue`<`BytesLike`\>[], `destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `claimed`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `claimed(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `expiration`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `expiration()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `lockingVault`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `lockingVault()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `reclaim`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `reclaim(address)`: (`destination`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `rewardsRoot`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `rewardsRoot()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `token`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `token()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\>  }[`K`]\>

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callStatic](ContractDataSource.md#callstatic)

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
| `K` | extends ``"fallback"`` \| ``"authorize(address)"`` \| ``"deauthorize(address)"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"deauthorize"`` \| ``"setOwner"`` \| ``"claim(uint256,uint256,bytes32[],address)"`` \| ``"claimAndDelegate(uint256,address,uint256,bytes32[],address)"`` \| ``"reclaim(address)"`` \| ``"claim"`` \| ``"claimAndDelegate"`` \| ``"reclaim"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `Airdrop`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
| `signer` | `Signer` | The Signer to connect to the contract with before calling. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`ContractTransaction`\>

A promise that resolves to the `ContractTransaction`.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callWithSigner](ContractDataSource.md#callwithsigner)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L83)

___

### claim

▸ **claim**(`signer`, `amount`, `totalGrant`, `merkleProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop and sends them to the user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merkleProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Implementation of

AirdropDataSource.claim

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:75](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L75)

___

### claimAndDelegate

▸ **claimAndDelegate**(`signer`, `amount`, `delegate`, `totalGrant`, `merklProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop, deposits it into the locking vault, and
delegates in a single transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `delegate` | `string` | The address the user will delegate to, WARNING - should not be zero. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merklProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Implementation of

AirdropDataSource.claimAndDelegate

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:102](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L102)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[clearCached](ContractDataSource.md#clearcached)

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

[ContractDataSource](ContractDataSource.md).[deleteCached](ContractDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"deauthorize(address)"`` \| ``"isAuthorized(address)"`` \| ``"owner()"`` \| ``"setOwner(address)"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"deauthorize"`` \| ``"isAuthorized"`` \| ``"owner"`` \| ``"setOwner"`` \| ``"claim(uint256,uint256,bytes32[],address)"`` \| ``"claimAndDelegate(uint256,address,uint256,bytes32[],address)"`` \| ``"claimed(address)"`` \| ``"expiration()"`` \| ``"lockingVault()"`` \| ``"reclaim(address)"`` \| ``"rewardsRoot()"`` \| ``"token()"`` \| ``"claim"`` \| ``"claimAndDelegate"`` \| ``"claimed"`` \| ``"expiration"`` \| ``"lockingVault"`` \| ``"reclaim"`` \| ``"rewardsRoot"`` \| ``"token"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `Airdrop`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCall](ContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L131)

___

### getClaimedAmount

▸ **getClaimedAmount**(`address`): `Promise`<`string`\>

Get the amount that an address has already claimed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

AirdropDataSource.getClaimedAmount

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:65](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L65)

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

[ContractDataSource](ContractDataSource.md).[getEvents](ContractDataSource.md#getevents)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:146](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L146)

___

### getExpiration

▸ **getExpiration**(): `Promise`<`number`\>

Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
owner).

#### Returns

`Promise`<`number`\>

#### Implementation of

AirdropDataSource.getExpiration

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:52](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L52)

___

### getLockingVault

▸ **getLockingVault**(): `Promise`<`string`\>

Get the address of the locking vault into which tokens will be deposited
when someone claims and delegates in a single tx.

#### Returns

`Promise`<`string`\>

#### Implementation of

AirdropDataSource.getLockingVault

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:71](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L71)

___

### getMerkleRoot

▸ **getMerkleRoot**(): `Promise`<`string`\>

Get The merkle root with deposits encoded into it as hash [address, amount]

#### Returns

`Promise`<`string`\>

#### Implementation of

AirdropDataSource.getMerkleRoot

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:57](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L57)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the token that will be paid out.

#### Returns

`Promise`<`string`\>

#### Implementation of

[AirdropDataSource](../interfaces/AirdropDataSource.md).[getToken](../interfaces/AirdropDataSource.md#gettoken)

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:61](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L61)

___

### getTokenDecimals

▸ `Private` **getTokenDecimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L43)

___

### reclaim

▸ **reclaim**(`signer`, `destination?`, `options?`): `Promise`<`string`\>

Remove funds from the airdrop after expiration

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Implementation of

AirdropDataSource.reclaim

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropContractDataSource.ts#L131)
