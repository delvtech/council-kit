[@council/sdk](../README.md) / [Exports](../modules.md) / VotingContractOptions

# Interface: VotingContractOptions

## Hierarchy

- [`ModelOptions`](ModelOptions.md)

  ↳ **`VotingContractOptions`**

## Table of contents

### Properties

- [dataSource](VotingContractOptions.md#datasource)
- [name](VotingContractOptions.md#name)

## Properties

### dataSource

• `Optional` **dataSource**: [`VotingContractDataSource`](VotingContractDataSource.md)

A data source to use instead of registering one with the `context`. If you
pass in a data source, you take over the responsibility of registering it
with the `context` to make it available to other models and data sources.

#### Defined in

[packages/council-sdk/src/models/votingContract/VotingContract.ts:31](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingContract/VotingContract.ts#L31)

___

### name

• `Optional` **name**: `string`

An arbitrary name for the instance. This is for convenience only (e.g.,
display name, debugging) and has no affect on the model's behavior.

#### Inherited from

[ModelOptions](ModelOptions.md).[name](ModelOptions.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:11](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L11)
