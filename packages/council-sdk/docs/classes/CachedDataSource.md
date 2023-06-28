[@council/sdk](../README.md) / [Exports](../modules.md) / CachedDataSource

# Class: CachedDataSource

A DataSource with methods for caching return values using an LRU cache.

**`See`**

https://github.com/isaacs/node-lru-cache

## Hierarchy

- **`CachedDataSource`**

  ↳ [`ContractDataSource`](ContractDataSource.md)

  ↳ [`HTTPDataSource`](HTTPDataSource.md)

## Implements

- [`DataSource`](../interfaces/DataSource.md)

## Table of contents

### Constructors

- [constructor](CachedDataSource.md#constructor)

### Properties

- [cache](CachedDataSource.md#cache)
- [context](CachedDataSource.md#context)

### Methods

- [cached](CachedDataSource.md#cached)
- [clearCached](CachedDataSource.md#clearcached)
- [deleteCached](CachedDataSource.md#deletecached)

## Constructors

### constructor

• **new CachedDataSource**(`context`, `cache?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `cache?` | `LRUCache`<`string`, `any`\> |

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:15](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L15)

## Properties

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[DataSource](../interfaces/DataSource.md).[context](../interfaces/DataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L12)

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

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L28)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

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

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L50)
