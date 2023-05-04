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

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:247](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L247)

___

### code

• **code**: ``"TRANSACTION_REPLACED"``

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:236](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L236)

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

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:244](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L244)

___

### receipt

• **receipt**: `ContractReceipt`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:251](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L251)

___

### replacement

• **replacement**: `ContractTransaction`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:249](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L249)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030
