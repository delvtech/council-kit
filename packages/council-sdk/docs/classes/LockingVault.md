[@council/sdk](../README.md) / [Exports](../modules.md) / LockingVault

# Class: LockingVault

A VotingVault that gives voting power for depositing tokens.

## Hierarchy

- [`VotingVault`](VotingVault.md)<[`LockingVaultContractDataSource`](LockingVaultContractDataSource.md)\>

  ↳ **`LockingVault`**

## Table of contents

### Constructors

- [constructor](LockingVault.md#constructor)

### Properties

- [address](LockingVault.md#address)
- [context](LockingVault.md#context)
- [dataSource](LockingVault.md#datasource)
- [name](LockingVault.md#name)

### Methods

- [changeDelegate](LockingVault.md#changedelegate)
- [deposit](LockingVault.md#deposit)
- [getDelegate](LockingVault.md#getdelegate)
- [getDelegatorsTo](LockingVault.md#getdelegatorsto)
- [getDepositedBalance](LockingVault.md#getdepositedbalance)
- [getHistoricalVotingPower](LockingVault.md#gethistoricalvotingpower)
- [getStaleBlockLag](LockingVault.md#getstaleblocklag)
- [getToken](LockingVault.md#gettoken)
- [getTotalVotingPower](LockingVault.md#gettotalvotingpower)
- [getVoters](LockingVault.md#getvoters)
- [getVotingPower](LockingVault.md#getvotingpower)
- [getVotingPowerBreakdown](LockingVault.md#getvotingpowerbreakdown)
- [withdraw](LockingVault.md#withdraw)

## Constructors

### constructor

• **new LockingVault**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`LockingVaultOptions`](../interfaces/LockingVaultOptions.md) |

#### Overrides

[VotingVault](VotingVault.md).[constructor](VotingVault.md#constructor)

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:21](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L21)

## Properties

### address

• **address**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[address](VotingVault.md#address)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:56](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L56)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Inherited from

[VotingVault](VotingVault.md).[context](VotingVault.md#context)

#### Defined in

[packages/council-sdk/src/models/Model.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L19)

___

### dataSource

• **dataSource**: [`LockingVaultContractDataSource`](LockingVaultContractDataSource.md)

#### Inherited from

[VotingVault](VotingVault.md).[dataSource](VotingVault.md#datasource)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:57](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L57)

___

### name

• **name**: `string`

#### Inherited from

[VotingVault](VotingVault.md).[name](VotingVault.md#name)

#### Defined in

[packages/council-sdk/src/models/Model.ts:20](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/Model.ts#L20)

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

[packages/council-sdk/src/models/votingVault/LockingVault.ts:160](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L160)

___

### deposit

▸ **deposit**(`signer`, `account`, `amount`, `firstDelegate?`, `options?`): `Promise`<`string`\>

Deposit tokens into this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with the tokens. |
| `account` | `string` | The address to credit this deposit to. |
| `amount` | `string` | The amount of tokens to deposit. (formatted decimal string) |
| `firstDelegate?` | `string` | The address to delegate the resulting voting power to if the account doesn't already have a delegate. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:177](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L177)

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

[packages/council-sdk/src/models/votingVault/LockingVault.ts:141](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L141)

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

[packages/council-sdk/src/models/votingVault/LockingVault.ts:149](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L149)

___

### getDepositedBalance

▸ **getDepositedBalance**(`address`): `Promise`<`string`\>

Get the amount of tokens that a given `address` has deposited into this
vault.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L50)

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

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:118](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L118)

___

### getStaleBlockLag

▸ **getStaleBlockLag**(): `Promise`<`number`\>

Get the number of blocks before the delegation history is forgotten. Voting
power from this vault can't be used on proposals that are older than the
stale block lag.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:110](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L110)

___

### getToken

▸ **getToken**(): `Promise`<[`Token`](Token.md)\>

Get the associated token for this LockingVault.

#### Returns

`Promise`<[`Token`](Token.md)\>

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:41](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L41)

___

### getTotalVotingPower

▸ **getTotalVotingPower**(`atBlock?`): `Promise`<`string`\>

Get the sum of voting power held by all voters in this Vesting Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atBlock?` | `number` | Get the total held at this block number. |

#### Returns

`Promise`<`string`\>

#### Overrides

[VotingVault](VotingVault.md).[getTotalVotingPower](VotingVault.md#gettotalvotingpower)

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:129](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L129)

___

### getVoters

▸ **getVoters**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all participants with voting power in this vault.

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

[packages/council-sdk/src/models/votingVault/LockingVault.ts:59](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L59)

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

[packages/council-sdk/src/models/votingVault/VotingVault.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L83)

___

### getVotingPowerBreakdown

▸ **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

Get all participants that have voting power in this vault along with their
voting power, the amount of voting power being delegated to them, and the
amount of power delegated to them by each delegator. This is a convenience
method to fetch voting power and delegation data for a large number of
voters in a single call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | Get a breakdown for a specific address. |
| `fromBlock?` | `number` | Include all voters that had power on or after this block number. |
| `toBlock?` | `number` | Include all voters that had power on or before this block number. |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Overrides

[VotingVault](VotingVault.md).[getVotingPowerBreakdown](VotingVault.md#getvotingpowerbreakdown)

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:82](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L82)

___

### withdraw

▸ **withdraw**(`signer`, `amount`, `options?`): `Promise`<`string`\>

Withdraw tokens from this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet with a deposited balance. |
| `amount` | `string` | The amount of tokens to withdraw. (formatted decimal string) |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingVault/LockingVault.ts:201](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/LockingVault.ts#L201)
