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

[packages/council-sdk/src/models/VotingVault/LockingVault.ts:12](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/VotingVault/LockingVault.ts#L12)

___

### name

• `Optional` **name**: `string`

An arbitrary name for the instance. This is for convenience only and has no
affect on the model's behavior.

#### Inherited from

[VotingVaultOptions](VotingVaultOptions.md).[name](VotingVaultOptions.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:11](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/models/Model.ts#L11)
