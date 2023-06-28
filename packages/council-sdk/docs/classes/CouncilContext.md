[@council/sdk](../README.md) / [Exports](../modules.md) / CouncilContext

# Class: CouncilContext

The Context stores common information used in model and data source methods
including shared data sources and their cache. It also includes a couple
utility methods for getting and registering new shared data sources.

## Table of contents

### Constructors

- [constructor](CouncilContext.md#constructor)

### Properties

- [dataSources](CouncilContext.md#datasources)
- [provider](CouncilContext.md#provider)

### Methods

- [getDataSource](CouncilContext.md#getdatasource)
- [registerDataSource](CouncilContext.md#registerdatasource)

## Constructors

### constructor

• **new CouncilContext**(`provider`, `options?`)

Create a new CouncilContext instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `Provider` | An [ethers Provider](https://docs.ethers.org/v5/api/providers/) instance. |
| `options?` | [`CouncilContextOptions`](../interfaces/CouncilContextOptions.md) | - |

#### Defined in

[packages/council-sdk/src/context/context.ts:36](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/context/context.ts#L36)

## Properties

### dataSources

• **dataSources**: [`DataSource`](../interfaces/DataSource.md)[]

A shared array of `DataSource` instances and their caches that will be
reused by models. When a new model instance is created, it will add any
missing data source instances it requires to this list.

#### Defined in

[packages/council-sdk/src/context/context.ts:29](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/context/context.ts#L29)

___

### provider

• **provider**: `Provider`

The [ethers Provider](https://docs.ethers.org/v5/api/providers/) instance
being used by data sources to fetch data from the blockchain.

#### Defined in

[packages/council-sdk/src/context/context.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/context/context.ts#L22)

## Methods

### getDataSource

▸ **getDataSource**<`T`\>(`filter`): ``null`` \| `T`

Get a shared `DataSource` who's properties match a given filter object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`DataSource`](../interfaces/DataSource.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `Partial`<`T`\> | An object of `DataSource` keys and values to look for. |

#### Returns

``null`` \| `T`

The first `DataSource` instance in the `dataSources` array that
matches the `filter`, or `null` if no match is found.

#### Defined in

[packages/council-sdk/src/context/context.ts:48](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/context/context.ts#L48)

___

### registerDataSource

▸ **registerDataSource**<`T`\>(`filter`, `dataSource`): `T`

Add a new shared `DataSource` if one matching a given filter object
doesn't already exist.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`DataSource`](../interfaces/DataSource.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `Partial`<`T`\> | An object of `DataSource` keys and values to look for. |
| `dataSource` | `T` | The `DataSource` to add if one matching the filter isn't found. |

#### Returns

`T`

The matching `DataSource` if found, else the added `DataSource`.

#### Defined in

[packages/council-sdk/src/context/context.ts:69](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/context/context.ts#L69)
