[@council/sdk](../README.md) / [Exports](../modules.md) / AirdropDataSource

# Interface: AirdropDataSource

An interface for fetching data from any airdrop.

## Hierarchy

- [`DataSource`](DataSource.md)

  ↳ **`AirdropDataSource`**

## Implemented by

- [`AirdropContractDataSource`](../classes/AirdropContractDataSource.md)

## Table of contents

### Properties

- [address](AirdropDataSource.md#address)
- [claim](AirdropDataSource.md#claim)
- [claimAndDelegate](AirdropDataSource.md#claimanddelegate)
- [context](AirdropDataSource.md#context)
- [getClaimedAmount](AirdropDataSource.md#getclaimedamount)
- [getExpiration](AirdropDataSource.md#getexpiration)
- [getLockingVault](AirdropDataSource.md#getlockingvault)
- [getMerkleRoot](AirdropDataSource.md#getmerkleroot)
- [reclaim](AirdropDataSource.md#reclaim)

### Methods

- [getToken](AirdropDataSource.md#gettoken)

## Properties

### address

• **address**: `string`

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:10](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L10)

___

### claim

• **claim**: (`signer`: `Signer`, `amount`: `string`, `totalGrant`: `string`, `merkleProof`: `string`[], `destination?`: `string`, `options?`: [`TransactionOptions`](TransactionOptions.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`signer`, `amount`, `totalGrant`, `merkleProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop and sends them to the user.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merkleProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](TransactionOptions.md) | - |

##### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L50)

___

### claimAndDelegate

• **claimAndDelegate**: (`signer`: `Signer`, `amount`: `string`, `delegate`: `string`, `totalGrant`: `string`, `merkleProof`: `string`[], `destination?`: `string`, `options?`: [`TransactionOptions`](TransactionOptions.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`signer`, `amount`, `delegate`, `totalGrant`, `merkleProof`, `destination?`, `options?`): `Promise`<`string`\>

Claims tokens from the airdrop, deposits it into the locking vault, and
delegates in a single transaction.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `amount` | `string` | Amount of tokens to claim. |
| `delegate` | `string` | The address the user will delegate to, WARNING - should not be zero. |
| `totalGrant` | `string` | The total amount of tokens the user was granted. |
| `merkleProof` | `string`[] | A set of hashes that can be used to reconstruct the path from a user (leaf) node to the merkle root, verifying that the user is part of the tree. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](TransactionOptions.md) | - |

##### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:72](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L72)

___

### context

• **context**: [`CouncilContext`](../classes/CouncilContext.md)

#### Inherited from

[DataSource](DataSource.md).[context](DataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/DataSource.ts:8](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/DataSource.ts#L8)

___

### getClaimedAmount

• **getClaimedAmount**: (`address`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`address`): `Promise`<`string`\>

Get the amount that an address has already claimed.

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:31](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L31)

___

### getExpiration

• **getExpiration**: () => `Promise`<`number`\>

#### Type declaration

▸ (): `Promise`<`number`\>

Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
owner).

##### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:16](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L16)

___

### getLockingVault

• **getLockingVault**: () => `Promise`<`string`\>

#### Type declaration

▸ (): `Promise`<`string`\>

Get the address of the locking vault into which tokens will be deposited
when someone claims and delegates in a single tx.

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:37](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L37)

___

### getMerkleRoot

• **getMerkleRoot**: () => `Promise`<`string`\>

#### Type declaration

▸ (): `Promise`<`string`\>

Get The merkle root with deposits encoded into it as hash [address, amount]

##### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:21](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L21)

___

### reclaim

• **reclaim**: (`signer`: `Signer`, `destination?`: `string`, `options?`: [`TransactionOptions`](TransactionOptions.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`signer`, `destination?`, `options?`): `Promise`<`string`\>

Remove funds from the airdrop after expiration

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `destination?` | `string` | The address which will be credited with funds. |
| `options?` | [`TransactionOptions`](TransactionOptions.md) | - |

##### Returns

`Promise`<`string`\>

- The transaction hash.

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:88](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L88)

## Methods

### getToken

▸ **getToken**(): `Promise`<`string`\>

Get the address of the token that will be paid out.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts:26](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/airdrop/AirdropDataSource.ts#L26)
