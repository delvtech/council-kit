[@council/sdk](../README.md) / [Exports](../modules.md) / VestingVault

# Class: VestingVault

A VotingVault that gives voting power for receiving grants and applies a
multiplier on unvested tokens to reduce their voting power.

## Hierarchy

- [`VotingVault`](VotingVault.md)<[`VestingVaultContractDataSource`](VestingVaultContractDataSource.md)\>

  ↳ **`VestingVault`**

## Table of contents

### Constructors

- [constructor](VestingVault.md#constructor)

### Properties

- [address](VestingVault.md#address)
- [context](VestingVault.md#context)
- [dataSource](VestingVault.md#datasource)
- [name](VestingVault.md#name)

### Methods

- [changeDelegate](VestingVault.md#changedelegate)
- [claim](VestingVault.md#claim)
- [getDelegate](VestingVault.md#getdelegate)
- [getDelegatorsTo](VestingVault.md#getdelegatorsto)
- [getGrant](VestingVault.md#getgrant)
- [getGrantWithdrawableAmount](VestingVault.md#getgrantwithdrawableamount)
- [getHistoricalVotingPower](VestingVault.md#gethistoricalvotingpower)
- [getStaleBlockLag](VestingVault.md#getstaleblocklag)
- [getToken](VestingVault.md#gettoken)
- [getTotalVotingPower](VestingVault.md#gettotalvotingpower)
- [getVoters](VestingVault.md#getvoters)
- [getVotingPower](VestingVault.md#getvotingpower)

## Constructors

### constructor

• **new VestingVault**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`VestingVaultOptions`](../interfaces/VestingVaultOptions.md) |

#### Overrides

[VotingVault](VotingVault.md).[constructor](VotingVault.md#constructor)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:23](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L23)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[address](VotingVault.md#address)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:47](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L47)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingVault](VotingVault.md).[context](VotingVault.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`VestingVaultContractDataSource`](VestingVaultContractDataSource.md)

#### Inherited from

[VotingVault](VotingVault.md).[dataSource](VotingVault.md#datasource)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:48](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L48)

___

### name

• **name**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[name](VotingVault.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/Model.ts#L20)

## Methods

### changeDelegate

▸ **changeDelegate**(`signer`, `delegate`, `options?`): `Promise`<`string`\>

Change current delegate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the address delegating. |
| `delegate` | `string` | The address to delegate to. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:164](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L164)

___

### claim

▸ **claim**(`signer`, `options?`): `Promise`<`string`\>

Claim a grant and withdraw the tokens.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with a grant to claim. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:177](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L177)

___

### getDelegate

▸ **getDelegate**(`address`): `Promise`<[`Voter`](Voter.md)\>

Get the current delegate of a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`Voter`](Voter.md)\>

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:145](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L145)

___

### getDelegatorsTo

▸ **getDelegatorsTo**(`address`, `atBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all voters delegated to a given address in this vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:153](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L153)

___

### getGrant

▸ **getGrant**(`address`): `Promise`<[`GrantData`](../interfaces/GrantData.md)\>

Get the grant data for a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`GrantData`](../interfaces/GrantData.md)\>

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:51](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L51)

___

### getGrantWithdrawableAmount

▸ **getGrantWithdrawableAmount**(`address`): `Promise`<`string`\>

Gets the amount of tokens currently claimable from the grant.
Mimics internal function https://github.com/element-fi/council/blob/main/contracts/vaults/VestingVault.sol#L434

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The grantee address. |

#### Returns

`Promise`<`string`\>

The amount of claimable tokens.

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:61](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L61)

___

### getHistoricalVotingPower

▸ **getHistoricalVotingPower**(`address`, `atBlock?`): `Promise`<`string`\>

Get the voting power for a given address at a given block without
accounting for the stale block lag.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `atBlock?` | `number` |

#### Returns

`Promise`<`string`\>

The historical voting power of the given address.

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:120](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L120)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:109](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L109)

___

### getToken

▸ **getToken**(): `Promise`<[`Token`](Token.md)\>

Get this vault's token.

#### Returns

`Promise`<[`Token`](Token.md)\>

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:43](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L43)

___

### getTotalVotingPower

▸ **getTotalVotingPower**(`atBlock?`): `Promise`<`string`\>

Get the sum of voting power held by all voters in this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atBlock?` | `number` | Get the total held at this block number. |

#### Returns

`Promise`<`string`\>

#### Overrides

[VotingVault](VotingVault.md).[getTotalVotingPower](VotingVault.md#gettotalvotingpower)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:134](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L134)

___

### getVoters

▸ **getVoters**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all participants that have voting power in this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Overrides

[VotingVault](VotingVault.md).[getVoters](VotingVault.md#getvoters)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VestingVault.ts:94](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VestingVault.ts#L94)

___

### getVotingPower

▸ **getVotingPower**(`address`, `atBlock?`, `extraData?`): `Promise`<`string`\>

Get the usable voting power owned by a given address in this vault.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | - |
| `atBlock?` | `number` | `undefined` | - |
| `extraData` | `BytesLike` | `"0x00"` | ABI encoded optional extra data used by some vaults, such as merkle proofs. |

#### Returns

`Promise`<`string`\>

#### Inherited from

[VotingVault](VotingVault.md).[getVotingPower](VotingVault.md#getvotingpower)

#### Defined in

[packages/council-sdk/src/models/VotingVault/VotingVault.ts:74](https://github.com/element-fi/council-monorepo/blob/cfb8869/packages/council-sdk/src/models/VotingVault/VotingVault.ts#L74)
