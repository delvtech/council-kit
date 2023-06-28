[@council/sdk](../README.md) / [Exports](../modules.md) / Airdrop

# Class: Airdrop

## Hierarchy

- [`Model`](Model.md)

  ↳ **`Airdrop`**

## Table of contents

### Constructors

- [constructor](Airdrop.md#constructor)

### Properties

- [address](Airdrop.md#address)
- [context](Airdrop.md#context)
- [dataSource](Airdrop.md#datasource)
- [name](Airdrop.md#name)

### Methods

- [claim](Airdrop.md#claim)
- [claimAndDelegate](Airdrop.md#claimanddelegate)
- [getClaimedAmount](Airdrop.md#getclaimedamount)
- [getExpiration](Airdrop.md#getexpiration)
- [getLockingVault](Airdrop.md#getlockingvault)
- [getMerkleRoot](Airdrop.md#getmerkleroot)
- [getToken](Airdrop.md#gettoken)

## Constructors

### constructor

• **new Airdrop**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`AirdropOptions`](../interfaces/AirdropOptions.md) |

#### Overrides

[Model](Model.md).[constructor](Model.md#constructor)

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:29](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L29)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:26](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L26)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[Model](Model.md).[context](Model.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`AirdropDataSource`](../interfaces/AirdropDataSource.md)

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:27](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L27)

___

### name

• **name**: `string`

#### Inherited from

[Model](Model.md).[name](Model.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### claim

▸ **claim**(`signer`, `amount`, `totalGrant`, `merkleProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop and sends them to the user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merkleProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:95](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L95)

___

### claimAndDelegate

▸ **claimAndDelegate**(`signer`, `amount`, `delegate`, `totalGrant`, `merkleProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop, deposits it into the locking vault, and
delegates in a single transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `delegate` | `string` | The address the user will delegate to, WARNING - should not be zero. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merkleProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:126](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L126)

___

### getClaimedAmount

▸ **getClaimedAmount**(`address`): `Promise`<`string`\>

Get the token balance of a given address

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:71](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L71)

___

### getExpiration

▸ **getExpiration**(): `Promise`<`Date`\>

Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
owner).

#### Returns

`Promise`<`Date`\>

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:48](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L48)

___

### getLockingVault

▸ **getLockingVault**(): `Promise`<[`LockingVault`](LockingVault.md)\>

Get the address of the locking vault into which tokens will be deposited
when someone claims and delegates in a single tx.

#### Returns

`Promise`<[`LockingVault`](LockingVault.md)\>

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:79](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L79)

___

### getMerkleRoot

▸ **getMerkleRoot**(): `Promise`<`string`\>

Get The merkle root with deposits encoded into it as hash [address, amount]

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:56](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L56)

___

### getToken

▸ **getToken**(): `Promise`<[`Token`](Token.md)\>

Get the token that will be paid out.

#### Returns

`Promise`<[`Token`](Token.md)\>

#### Defined in

[packages/council-sdk/src/models/Airdrop.ts:63](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Airdrop.ts#L63)
