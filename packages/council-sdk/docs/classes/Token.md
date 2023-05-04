[@council/sdk](../README.md) / [Exports](../modules.md) / Token

# Class: Token

## Hierarchy

- [`Model`](Model.md)

  ↳ **`Token`**

## Table of contents

### Constructors

- [constructor](Token.md#constructor)

### Properties

- [address](Token.md#address)
- [context](Token.md#context)
- [dataSource](Token.md#datasource)
- [name](Token.md#name)

### Methods

- [approve](Token.md#approve)
- [getAllowance](Token.md#getallowance)
- [getBalanceOf](Token.md#getbalanceof)
- [getDecimals](Token.md#getdecimals)
- [getName](Token.md#getname)
- [getSymbol](Token.md#getsymbol)

## Constructors

### constructor

• **new Token**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`TokenOptions`](../interfaces/TokenOptions.md) |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/Token.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L28)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/models/Token.ts:25](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L25)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`TokenDataSource`](../interfaces/TokenDataSource.md)

#### Defined in

[packages/council-sdk/src/models/Token.ts:26](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L26)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### approve

▸ **approve**(`signer`, `spender`, `amount`, `options?`): `Promise`<`string`\>

Give a spending allowance to a given spender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the owner. |
| `spender` | `string` | The address of the spender. |
| `amount` | `string` | The amount of tokens the spender can spend. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/Token.ts:86](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L86)

___

### getAllowance

▸ **getAllowance**(`owner`, `spender`): `Promise`<`string`\>

Get the spending allowance of a given spender for a given owner of this
token.

#### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `string` |
| `spender` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Token.ts:68](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L68)

___

### getBalanceOf

▸ **getBalanceOf**(`address`): `Promise`<`string`\>

Get the token balance of a given address

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Token.ts:75](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L75)

___

### getDecimals

▸ **getDecimals**(): `Promise`<`number`\>

Get the number of decimal places this token uses.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/Token.ts:53](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L53)

___

### getName

▸ **getName**(): `Promise`<`string`\>

Get the name of this token

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Token.ts:60](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L60)

___

### getSymbol

▸ **getSymbol**(): `Promise`<`string`\>

Get the symbol for this token.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Token.ts:46](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Token.ts#L46)
