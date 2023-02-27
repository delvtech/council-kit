[@council/sdk](../README.md) / [Exports](../modules.md) / VotingVaultContractDataSource

# Class: VotingVaultContractDataSource<TVault\>

A DataSource with methods for making cached calls to any voting vault
contract that implements `IVotingVault` or `GSCVault` from the Council
protocol.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TVault` | extends `IVotingVault` \| `GSCVault` = `IVotingVault` |

## Hierarchy

- [`ContractDataSource`](ContractDataSource.md)<`TVault`\>

  ↳ **`VotingVaultContractDataSource`**

  ↳↳ [`GSCVaultContractDataSource`](GSCVaultContractDataSource.md)

  ↳↳ [`LockingVaultContractDataSource`](LockingVaultContractDataSource.md)

  ↳↳ [`VestingVaultContractDataSource`](VestingVaultContractDataSource.md)

## Implements

- [`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)

## Table of contents

### Constructors

- [constructor](VotingVaultContractDataSource.md#constructor)

### Properties

- [address](VotingVaultContractDataSource.md#address)
- [cache](VotingVaultContractDataSource.md#cache)
- [context](VotingVaultContractDataSource.md#context)
- [contract](VotingVaultContractDataSource.md#contract)

### Methods

- [cached](VotingVaultContractDataSource.md#cached)
- [call](VotingVaultContractDataSource.md#call)
- [callStatic](VotingVaultContractDataSource.md#callstatic)
- [callWithSigner](VotingVaultContractDataSource.md#callwithsigner)
- [clearCached](VotingVaultContractDataSource.md#clearcached)
- [deleteCached](VotingVaultContractDataSource.md#deletecached)
- [deleteCall](VotingVaultContractDataSource.md#deletecall)
- [getVotingPower](VotingVaultContractDataSource.md#getvotingpower)

## Constructors

### constructor

• **new VotingVaultContractDataSource**<`TVault`\>(`vault`, `context`)

Create a new `VotingVaultContractDataSource` instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TVault` | extends `IVotingVault` \| `GSCVault` = `IVotingVault` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | `string` \| `TVault` | An `IVotingVault` or `GSCVault` instance from the `@council/typechain` package or the address of the vault contract. |
| `context` | [`CouncilContext`](CouncilContext.md) | - |

#### Overrides

[ContractDataSource](ContractDataSource.md).[constructor](ContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts:29](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts#L29)

## Properties

### address

• **address**: `string`

#### Implementation of

[VotingVaultDataSource](../interfaces/VotingVaultDataSource.md).[address](../interfaces/VotingVaultDataSource.md#address)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[address](ContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:22](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cache](ContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:13](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[VotingVaultDataSource](../interfaces/VotingVaultDataSource.md).[context](../interfaces/VotingVaultDataSource.md#context)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[context](ContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:12](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/CachedDataSource.ts#L12)

___

### contract

• **contract**: `TVault`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[contract](ContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:23](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L23)

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

[packages/council-sdk/src/datasources/CachedDataSource.ts:28](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/CachedDataSource.ts#L28)

___

### call

▸ **call**<`K`\>(`method`, `args`): `TVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `TVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`TVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[call](ContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:43](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<`TVault`[``"callStatic"``][`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `TVault`[``"callStatic"``][`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<`TVault`[``"callStatic"``][`K`]\>

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callStatic](ContractDataSource.md#callstatic)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:62](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L62)

___

### callWithSigner

▸ **callWithSigner**<`K`\>(`method`, `args`, `signer`, `options?`): `Promise`<`ContractTransaction`\>

Call a write method on the contract with a signer and wait for the
transaction to resolve. If the transaction fails, this will throw an error.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `TVault`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
| `signer` | `Signer` | The Signer to connect to the contract with before calling. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`ContractTransaction`\>

A promise that resolves to the `ContractTransaction`.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callWithSigner](ContractDataSource.md#callwithsigner)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:83](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L83)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[clearCached](ContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/CachedDataSource.ts:42](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/CachedDataSource.ts#L42)

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

[packages/council-sdk/src/datasources/CachedDataSource.ts:50](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `TVault`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCall](ContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:131](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/ContractDataSource.ts#L131)

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

#### Defined in

[packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts:44](https://github.com/element-fi/council-monorepo/blob/d38feb9/packages/council-sdk/src/datasources/VotingVault/VotingVaultContractDataSource.ts#L44)
