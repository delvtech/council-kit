[@council/sdk](../README.md) / [Exports](../modules.md) / Vote

# Class: Vote

## Hierarchy

- [`Model`](Model.md)

  ↳ **`Vote`**

## Table of contents

### Constructors

- [constructor](Vote.md#constructor)

### Properties

- [ballot](Vote.md#ballot)
- [context](Vote.md#context)
- [name](Vote.md#name)
- [power](Vote.md#power)
- [proposal](Vote.md#proposal)
- [voter](Vote.md#voter)

## Constructors

### constructor

• **new Vote**(`power`, `ballot`, `voter`, `proposal`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `power` | `string` |
| `ballot` | [`Ballot`](../modules.md#ballot) |
| `voter` | [`Voter`](Voter.md) |
| `proposal` | [`Proposal`](Proposal.md) |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`ModelOptions`](../interfaces/ModelOptions.md) |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/Vote.ts:16](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Vote.ts#L16)

## Properties

### ballot

• **ballot**: [`Ballot`](../modules.md#ballot)

#### Defined in

[packages/council-sdk/src/models/Vote.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Vote.ts#L12)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

___

### power

• **power**: `string`

#### Defined in

[packages/council-sdk/src/models/Vote.ts:11](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Vote.ts#L11)

___

### proposal

• **proposal**: [`Proposal`](Proposal.md)

#### Defined in

[packages/council-sdk/src/models/Vote.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Vote.ts#L13)

___

### voter

• **voter**: [`Voter`](Voter.md)

#### Defined in

[packages/council-sdk/src/models/Vote.ts:14](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Vote.ts#L14)
