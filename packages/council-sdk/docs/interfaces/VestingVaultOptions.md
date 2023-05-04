[@council/sdk](../README.md) / [Exports](../modules.md) / VestingVaultOptions

# Interface: VestingVaultOptions

## Hierarchy

- [`VotingVaultOptions`](VotingVaultOptions.md)

  ↳ **`VestingVaultOptions`**

## Table of contents

### Properties

- [dataSource](VestingVaultOptions.md#datasource)
- [name](VestingVaultOptions.md#name)

## Properties

### dataSource

• `Optional` **dataSource**: [`VestingVaultContractDataSource`](../classes/VestingVaultContractDataSource.md)

A data source to use instead of registering one with the `context`. If you
pass in a data source, you take over the responsibility of registering it
with the `context` to make it available to other models and data sources.

#### Overrides

[VotingVaultOptions](VotingVaultOptions.md).[dataSource](VotingVaultOptions.md#datasource)

#### Defined in

[packages/council-sdk/src/models/votingVault/VestingVault.ts:15](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VestingVault.ts#L15)

___

### name

• `Optional` **name**: `string`

An arbitrary name for the instance. This is for convenience only (e.g.,
display name, debugging) and has no affect on the model's behavior.

#### Inherited from

[VotingVaultOptions](VotingVaultOptions.md).[name](VotingVaultOptions.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:11](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L11)
