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

[packages/council-sdk/src/datasources/ContractDataSource.ts:206](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/datasources/ContractDataSource.ts#L206)

___

### code

• **code**: ``"TRANSACTION_REPLACED"``

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:195](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/datasources/ContractDataSource.ts#L195)

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:203](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/datasources/ContractDataSource.ts#L203)

___

### receipt

• **receipt**: `ContractReceipt`

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:210](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/datasources/ContractDataSource.ts#L210)

___

### replacement

• **replacement**: `ContractTransaction`

#### Defined in

[packages/council-sdk/src/datasources/ContractDataSource.ts:208](https://github.com/element-fi/council-monorepo/blob/badbd3c/packages/council-sdk/src/datasources/ContractDataSource.ts#L208)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030
