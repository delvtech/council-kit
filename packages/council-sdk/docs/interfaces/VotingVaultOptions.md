[@council/sdk](../README.md) / [Exports](../modules.md) / VotingVaultOptions

# Interface: VotingVaultOptions<TDataSource\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TDataSource` | extends [`VotingVaultDataSource`](VotingVaultDataSource.md) = [`VotingVaultDataSource`](VotingVaultDataSource.md) |

## Hierarchy

- [`ModelOptions`](ModelOptions.md)

  ↳ **`VotingVaultOptions`**

  ↳↳ [`GSCVaultOptions`](GSCVaultOptions.md)

  ↳↳ [`LockingVaultOptions`](LockingVaultOptions.md)

  ↳↳ [`VestingVaultOptions`](VestingVaultOptions.md)

## Table of contents

### Properties

- [dataSource](VotingVaultOptions.md#datasource)
- [name](VotingVaultOptions.md#name)

## Properties

### dataSource

• `Optional` **dataSource**: `TDataSource`

A data source to use instead of registering one with the `context`. If you
pass in a data source, you take over the responsibility of registering it
with the `context` to make it available to other models and data sources.

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:19](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L19)

___

### name

• `Optional` **name**: `string`

An arbitrary name for the instance. This is for convenience only and has no
affect on the model's behavior.

#### Inherited from

[ModelOptions](ModelOptions.md).[name](ModelOptions.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:11](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/Model.ts#L11)
