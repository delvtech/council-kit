[@council/sdk](../README.md) / [Exports](../modules.md) / TokenDataSource

# Interface: TokenDataSource

An interface for fetching data from any token.

## Hierarchy

- [`DataSource`](DataSource.md)

  ↳ **`TokenDataSource`**

## Implemented by

- [`ERC20ContractDataSource`](../classes/ERC20ContractDataSource.md)

## Table of contents

### Properties

- [address](TokenDataSource.md#address)
- [approve](TokenDataSource.md#approve)
- [context](TokenDataSource.md#context)
- [getAllowance](TokenDataSource.md#getallowance)
- [getBalanceOf](TokenDataSource.md#getbalanceof)
- [getDecimals](TokenDataSource.md#getdecimals)
- [getName](TokenDataSource.md#getname)
- [getSymbol](TokenDataSource.md#getsymbol)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:10](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L10)

___

### approve

• **approve**: (`signer`: `Signer`, `spender`: `string`, `amount`: `BigNumber`, `options?`: [`TransactionOptions`](TransactionOptions.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`signer`, `spender`, `amount`, `options?`): `Promise`<`string`\>

Sets approval of token access up to a certain amount

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `spender` | `string` | Address to approve access to. |
| `amount` | `BigNumber` | Amount approved for, defaults to maximum. |
| `options?` | [`TransactionOptions`](TransactionOptions.md) | - |

##### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:47](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L47)

___

### context

• **context**: [`CouncilContext`](../classes/CouncilContext.md)

#### Inherited from

[DataSource](DataSource.md).[context](DataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/DataSource.ts:8](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/DataSource.ts#L8)

___

### getAllowance

• **getAllowance**: (`owner`: `string`, `spender`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`owner`, `spender`): `Promise`<`string`\>

Get the spending allowance of a given spender for a given owner of this
token.

##### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `string` |
| `spender` | `string` |

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:33](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L33)

___

### getBalanceOf

• **getBalanceOf**: (`address`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`address`): `Promise`<`string`\>

Get the amount of tokens owned by a given address.

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:38](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L38)

___

### getDecimals

• **getDecimals**: () => `Promise`<`number`\>

#### Type declaration

▸ (): `Promise`<`number`\>

Get the number of decimals used to format a balance for display. For
example, if decimals equals 2, a balance of `505` tokens should be
displayed as `5.05` (`505 / 10 ** 2`).

##### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:27](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L27)

___

### getName

• **getName**: () => `Promise`<`string`\>

#### Type declaration

▸ (): `Promise`<`string`\>

Get the name of this token.

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L20)

___

### getSymbol

• **getSymbol**: () => `Promise`<`string`\>

#### Type declaration

▸ (): `Promise`<`string`\>

Get the symbol of this token, usually a shorter version of the name.

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/token/TokenDataSource.ts:15](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/TokenDataSource.ts#L15)
