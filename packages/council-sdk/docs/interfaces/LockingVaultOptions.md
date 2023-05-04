[@council/sdk](../README.md) / [Exports](../modules.md) / LockingVaultOptions

# Interface: LockingVaultOptions

## Hierarchy

- [`VotingVaultOptions`](VotingVaultOptions.md)

  ↳ **`LockingVaultOptions`**

## Table of contents

### Properties

- [dataSource](LockingVaultOptions.md#datasource)
- [name](LockingVaultOptions.md#name)

## Properties

### dataSource

• `Optional` **dataSource**: [`LockingVaultContractDataSource`](../classes/LockingVaultContractDataSource.md)

A data source to use instead of registering one with the `context`. If you
pass in a data source, you take over the responsibility of registering it
with the `context` to make it available to other models and data sources.

#### Overrides

[VotingVaultOptions](VotingVaultOptions.md).[dataSource](VotingVaultOptions.md#datasource)

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L13)

___

### name

• `Optional` **name**: `string`

An arbitrary name for the instance. This is for convenience only (e.g.,
display name, debugging) and has no affect on the model's behavior.

#### Inherited from

[VotingVaultOptions](VotingVaultOptions.md).[name](VotingVaultOptions.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:11](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L11)
