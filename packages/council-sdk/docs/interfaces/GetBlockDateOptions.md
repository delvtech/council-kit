[@council/sdk](../README.md) / [Exports](../modules.md) / GetBlockDateOptions

# Interface: GetBlockDateOptions<TEstimate\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEstimate` | extends `boolean` = ``false`` |

## Table of contents

### Properties

- [blockTime](GetBlockDateOptions.md#blocktime)
- [estimateFutureDates](GetBlockDateOptions.md#estimatefuturedates)

## Properties

### blockTime

• `Optional` **blockTime**: `number`

The number of seconds it takes to mine a block; used when estimating the
date of a block that hasn't been mined yet. Defaults to 12.07

#### Defined in

[packages/council-sdk/src/utils/getBlockDate.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/getBlockDate.ts#L20)

___

### estimateFutureDates

• `Optional` **estimateFutureDates**: `TEstimate`

If true, dates for blocks that haven't been mined yet will be estimated
based on the `blockTime` option. If false, blocks that haven't been mined
yet will return `null`.

#### Defined in

[packages/council-sdk/src/utils/getBlockDate.ts:15](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/utils/getBlockDate.ts#L15)
