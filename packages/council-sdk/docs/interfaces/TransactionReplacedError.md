[@council/sdk](../README.md) / [Exports](../modules.md) / TransactionReplacedError

# Interface: TransactionReplacedError

## Hierarchy

- `Error`

  ↳ **`TransactionReplacedError`**

## Table of contents

### Properties

- [cancelled](TransactionReplacedError.md#cancelled)
- [code](TransactionReplacedError.md#code)
- [message](TransactionReplacedError.md#message)
- [name](TransactionReplacedError.md#name)
- [reason](TransactionReplacedError.md#reason)
- [receipt](TransactionReplacedError.md#receipt)
- [replacement](TransactionReplacedError.md#replacement)
- [stack](TransactionReplacedError.md#stack)

## Properties

### cancelled

• **cancelled**: `boolean`

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:249](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/ContractDataSource.ts#L249)

___

### code

• **code**: ``"TRANSACTION_REPLACED"``

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:238](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/ContractDataSource.ts#L238)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1029

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

___

### reason

• **reason**: ``"repriced"`` \| ``"cancelled"`` \| ``"replaced"``

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:246](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/ContractDataSource.ts#L246)

___

### receipt

• **receipt**: `ContractReceipt`

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:253](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/ContractDataSource.ts#L253)

___

### replacement

• **replacement**: `ContractTransaction`

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:251](https://github.com/element-fi/council-monorepo/blob/887341f/packages/council-sdk/src/datasources/ContractDataSource.ts#L251)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030
