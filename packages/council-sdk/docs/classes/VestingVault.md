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
- [getUnvestedMultiplier](VestingVault.md#getunvestedmultiplier)
- [getVoters](VestingVault.md#getvoters)
- [getVotingPower](VestingVault.md#getvotingpower)
- [getVotingPowerBreakdown](VestingVault.md#getvotingpowerbreakdown)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:24](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L24)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[address](VotingVault.md#address)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:51](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VotingVault.ts#L51)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingVault](VotingVault.md).[context](VotingVault.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`VestingVaultContractDataSource`](VestingVaultContractDataSource.md)

#### Inherited from

[VotingVault](VotingVault.md).[dataSource](VotingVault.md#datasource)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:52](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VotingVault.ts#L52)

___

### name

• **name**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[name](VotingVault.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/Model.ts#L20)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:204](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L204)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:217](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L217)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:185](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L185)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:193](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L193)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:62](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L62)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:72](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L72)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:163](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L163)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/VestingVault.ts:152](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L152)

___

### getToken

▸ **getToken**(): `Promise`<[`Token`](Token.md)\>

Get this vault's token.

#### Returns

`Promise`<[`Token`](Token.md)\>

#### Defined in

[packages/council-sdk/src/models/votingVault/VestingVault.ts:44](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L44)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:174](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L174)

___

### getUnvestedMultiplier

▸ **getUnvestedMultiplier**(): `Promise`<`number`\>

Get this vault's unvested multiplier, a number that represents the voting
power of each unvested token as a percentage of a vested token. For example
if unvested tokens have 50% voting power compared to vested ones, this
value would be 50.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/VestingVault.ts:55](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L55)

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

[packages/council-sdk/src/models/votingVault/VestingVault.ts:105](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L105)

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

[packages/council-sdk/src/models/votingVault/VotingVault.ts:78](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VotingVault.ts#L78)

___

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`fromBlock?`, `toBlock?`): `Promise`<[`VoterPowerBreakdown`](../interfaces/VoterPowerBreakdown.md)[]\>

Get all participants that have voting power in this vault along with their
voting power, the amount of voting power being delegated to them, and the
amount of power delegated to them by each delegator. This is a convenience
method to fetch voting power and delegation data for a large number of
voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<[`VoterPowerBreakdown`](../interfaces/VoterPowerBreakdown.md)[]\>

#### Overrides

[VotingVault](VotingVault.md).[getVotingPowerBreakdown](VotingVault.md#getvotingpowerbreakdown)

#### Defined in

[packages/council-sdk/src/models/votingVault/VestingVault.ts:126](https://github.com/element-fi/council-monorepo/blob/c3de473/packages/council-sdk/src/models/votingVault/VestingVault.ts#L126)
