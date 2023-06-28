[@council/sdk](../README.md) / [Exports](../modules.md) / TransactionOptions

# Interface: TransactionOptions

## Table of contents

### Properties

- [onCancelled](TransactionOptions.md#oncancelled)
- [onRepriced](TransactionOptions.md#onrepriced)
- [onSubmitted](TransactionOptions.md#onsubmitted)

## Properties

### onCancelled

• `Optional` **onCancelled**: (`transaction`: `string`) => `void`

#### Type declaration

▸ (`transaction`): `void`

A function called when the transaction is canceled.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `string` | The transaction hash. |

##### Returns

`void`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:194](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L194)

___

### onRepriced

• `Optional` **onRepriced**: (`transaction`: `string`) => `void`

#### Type declaration

▸ (`transaction`): `void`

A function called when the transaction is repriced.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `string` | The transaction hash. |

##### Returns

`void`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:200](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L200)

___

### onSubmitted

• `Optional` **onSubmitted**: (`transaction`: `string`) => `void`

#### Type declaration

▸ (`transaction`): `void`

A function called when the transaction is submitted to the blockchain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `string` | The transaction hash. |

##### Returns

`void`

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:188](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L188)
