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
- [getAllVotersWithPower](LockingVaultContractDataSource.md#getallvoterswithpower)
- [getDelegate](LockingVaultContractDataSource.md#getdelegate)
- [getDelegatorsTo](LockingVaultContractDataSource.md#getdelegatorsto)
- [getDepositedBalance](LockingVaultContractDataSource.md#getdepositedbalance)
- [getHistoricalVotingPower](LockingVaultContractDataSource.md#gethistoricalvotingpower)
- [getStaleBlockLag](LockingVaultContractDataSource.md#getstaleblocklag)
- [getToken](LockingVaultContractDataSource.md#gettoken)
- [getVoteChangeEvents](LockingVaultContractDataSource.md#getvotechangeevents)
- [getVotingPower](LockingVaultContractDataSource.md#getvotingpower)
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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:17](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L17)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[address](VotingVaultContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:22](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[cache](VotingVaultContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:13](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[context](VotingVaultContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:12](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L12)

___

### contract

• **contract**: `LockingVault`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[contract](VotingVaultContractDataSource.md#contract)

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

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[cached](VotingVaultContractDataSource.md#cached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:28](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L28)

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
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:43](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L43)

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
| `K` | extends ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:62](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L62)

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:83](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L83)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:159](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L159)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[clearCached](VotingVaultContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:42](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L42)

___

### clearTokenCached

▸ `Private` **clearTokenCached**(): `Promise`<`void`\>

Checks the `context` for a `TokenDataSource` for this vault's
token and clears the cache if it's a `CachedDataSource`.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:227](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L227)

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

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[deleteCached](VotingVaultContractDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:50](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"queryVotePower(address,uint256,bytes)"`` \| ``"queryVotePower"`` \| ``"changeDelegation"`` \| ``"changeDelegation(address)"`` \| ``"deposit"`` \| ``"deposit(address,uint256,address)"`` \| ``"deposits"`` \| ``"deposits(address)"`` \| ``"queryVotePowerView"`` \| ``"queryVotePowerView(address,uint256)"`` \| ``"staleBlockLag"`` \| ``"staleBlockLag()"`` \| ``"token"`` \| ``"token()"`` \| ``"withdraw"`` \| ``"withdraw(uint256)"`` |

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:131](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/ContractDataSource.ts#L131)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:183](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L183)

___

### getAllVotersWithPower

▸ **getAllVotersWithPower**(`fromBlock?`, `toBlock?`): `Promise`<[`VoterWithPower`](../interfaces/VoterWithPower.md)[]\>

Get the address and voting power of all participants that have voting power
in this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | The block number to start searching for voters from. |
| `toBlock?` | `number` | The block number to stop searching for voters at. |

#### Returns

`Promise`<[`VoterWithPower`](../interfaces/VoterWithPower.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:106](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L106)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:41](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L41)

___

### getDelegatorsTo

▸ **getDelegatorsTo**(`address`, `atBlock?`): `Promise`<[`VoterWithPower`](../interfaces/VoterWithPower.md)[]\>

Get the addresses of all voters delegated to a given address in this vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<[`VoterWithPower`](../interfaces/VoterWithPower.md)[]\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:49](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L49)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:33](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L33)

___

### getHistoricalVotingPower

▸ **getHistoricalVotingPower**(`address`, `atBlock`): `Promise`<`string`\>

Get the voting power for a given address at a given block without
accounting for the stale block lag.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:89](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L89)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:80](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L80)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the associated token for this vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:25](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L25)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:141](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L141)

___

### getVotingPower

▸ **getVotingPower**(`this`, `address`, `atBlock`, `extraData?`): `Promise`<`string`\>

Get the voting power owned by a given address in this vault. Returns "0" if
the voting power is unable to be fetched.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`ContractDataSource`](ContractDataSource.md)<`IVotingVault`\> | `undefined` | - |
| `address` | `string` | `undefined` | - |
| `atBlock` | `number` | `undefined` | - |
| `extraData` | `BytesLike` | `"0x00"` | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Inherited from

[VotingVaultContractDataSource](VotingVaultContractDataSource.md).[getVotingPower](VotingVaultContractDataSource.md#getvotingpower)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts:44](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts#L44)

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

[packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts:207](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/datasources/VotingVault/LockingVaultContractDataSource.ts#L207)
