[@council/sdk](../README.md) / [Exports](../modules.md) / HTTPDataSource

# Class: HTTPDataSource<T\>

A DataSource with methods for caching requests to an HTTP API.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`CachedDataSource`](CachedDataSource.md)

  ↳ **`HTTPDataSource`**

## Table of contents

### Constructors

- [constructor](HTTPDataSource.md#constructor)

### Properties

- [baseURL](HTTPDataSource.md#baseurl)
- [cache](HTTPDataSource.md#cache)
- [context](HTTPDataSource.md#context)
- [defaultDeleteOptions](HTTPDataSource.md#defaultdeleteoptions)
- [defaultGetOptions](HTTPDataSource.md#defaultgetoptions)
- [defaultPostOptions](HTTPDataSource.md#defaultpostoptions)
- [defaultPutOptions](HTTPDataSource.md#defaultputoptions)
- [defaultRequestOptions](HTTPDataSource.md#defaultrequestoptions)
- [onResponse](HTTPDataSource.md#onresponse)

### Methods

- [cached](HTTPDataSource.md#cached)
- [clearCached](HTTPDataSource.md#clearcached)
- [delete](HTTPDataSource.md#delete)
- [deleteCached](HTTPDataSource.md#deletecached)
- [get](HTTPDataSource.md#get)
- [post](HTTPDataSource.md#post)
- [put](HTTPDataSource.md#put)

## Constructors

### constructor

• **new HTTPDataSource**<`T`\>(`baseURL`, `context`, `options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseURL` | `string` | - |
| `context` | [`CouncilContext`](CouncilContext.md) | - |
| `options?` | `Object` | - |
| `options.defaultDeleteOptions?` | `RequestInit` | The default options that are used for the `delete` method. This will be merged with and overwrite `defaultRequestOptions`. |
| `options.defaultGetOptions?` | `RequestInit` | The default options that are used for the `get` method. This will be merged with and overwrite `defaultRequestOptions`. |
| `options.defaultPostOptions?` | `RequestInit` | The default options that are used for the `post` method. This will be merged with and overwrite `defaultRequestOptions`. |
| `options.defaultPutOptions?` | `RequestInit` | The default options that are used for the `put` method. This will be merged with and overwrite `defaultRequestOptions`. |
| `options.defaultRequestOptions?` | `RequestInit` | The default options that are used for all request methods. |
| `options.onResponse?` | (`res`: `Response`) => `Promise`<`T`\> | A function that processes the API's responses and returns the desired data. The default implementation uses `response.json()` to parse the response as JSON. |

#### Overrides

[CachedDataSource](CachedDataSource.md).[constructor](CachedDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:53](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L53)

## Properties

### baseURL

• **baseURL**: `string`

The base URL prefixed to all method paths.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L12)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[CachedDataSource](CachedDataSource.md).[cache](CachedDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[CachedDataSource](CachedDataSource.md).[context](CachedDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L12)

___

### defaultDeleteOptions

• **defaultDeleteOptions**: `RequestInit`

The default options that are used for the `delete` method.
This will be merged with and overwrite the `defaultRequestOptions`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:42](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L42)

___

### defaultGetOptions

• **defaultGetOptions**: `RequestInit`

The default options that are used for the `get` method.
This will be merged with and overwrite the `defaultRequestOptions`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:24](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L24)

___

### defaultPostOptions

• **defaultPostOptions**: `RequestInit`

The default options that are used for the `post` method.
This will be merged with and overwrite the `defaultRequestOptions`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:30](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L30)

___

### defaultPutOptions

• **defaultPutOptions**: `RequestInit`

The default options that are used for the `put` method.
This will be merged with and overwrite the `defaultRequestOptions`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:36](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L36)

___

### defaultRequestOptions

• **defaultRequestOptions**: `RequestInit`

The default options that are used for all request methods.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:17](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L17)

___

### onResponse

• **onResponse**: (`res`: `Response`) => `Promise`<`T`\>

#### Type declaration

▸ (`res`): `Promise`<`T`\>

A function that processes the API's responses and returns the desired data.
The default implementation uses `response.json()` to parse the response as
JSON.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `res` | `Response` | the response from the API. |

##### Returns

`Promise`<`T`\>

a promise that resolves to the processed response data.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:51](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L51)

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

[CachedDataSource](CachedDataSource.md).[cached](CachedDataSource.md#cached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L28)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[CachedDataSource](CachedDataSource.md).[clearCached](CachedDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:42](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L42)

___

### delete

▸ **delete**<`T`\>(`path`, `options?`): `Promise`<`T`\>

Make a `DELETE` request to the API.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | the path to append to the `baseURL`. |
| `options` | `RequestInit` | - |

#### Returns

`Promise`<`T`\>

a promise that resolves to the response data processed by
  `onResponse`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:202](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L202)

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

[CachedDataSource](CachedDataSource.md).[deleteCached](CachedDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L50)

___

### get

▸ **get**<`T`\>(`path`, `options?`): `Promise`<`T`\>

Make a `GET` request to the API and cache the result with a key made from
the method type and the path.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | the path to append to the `baseURL`. |
| `options` | `RequestInit` | - |

#### Returns

`Promise`<`T`\>

a promise that resolves to the response data processed by
  `onResponse`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:161](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L161)

___

### post

▸ **post**<`T`\>(`path`, `options`): `Promise`<`T`\>

Make a `POST` request to the API and cache the result with a key made from
the method type, the path, and the request body.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | the path to append to the `baseURL`. |
| `options` | `RequestInit` | - |

#### Returns

`Promise`<`T`\>

a promise that resolves to the response data processed by
  `onResponse`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:140](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L140)

___

### put

▸ **put**<`T`\>(`path`, `options`): `Promise`<`T`\>

Make a `PUT` request to the API and cache the result with a key made from
the method type, the path, and the request body.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | the path to append to the `baseURL`. |
| `options` | `RequestInit` | - |

#### Returns

`Promise`<`T`\>

a promise that resolves to the response data processed by
  `onResponse`.

#### Defined in

[packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts:182](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/http/HTTPDataSource.ts#L182)
