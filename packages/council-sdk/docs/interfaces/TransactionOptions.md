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

[packages/council-sdk/src/datasources/ContractDataSource.ts:153](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L153)

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:159](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L159)

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

[packages/council-sdk/src/datasources/ContractDataSource.ts:147](https://github.com/element-fi/council-monorepo/blob/1bac428/packages/council-sdk/src/datasources/ContractDataSource.ts#L147)
