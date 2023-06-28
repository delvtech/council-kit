[@council/sdk](../README.md) / [Exports](../modules.md) / GSCVault

# Class: GSCVault

A VotingVault for the Governance Steering Council in which each member has a
single vote and must maintain a minimum required voting power in the core
voting vaults to remain eligible.

## Hierarchy

- [`VotingVault`](VotingVault.md)<[`GSCVaultContractDataSource`](GSCVaultContractDataSource.md)\>

  ↳ **`GSCVault`**

## Table of contents

### Constructors

- [constructor](GSCVault.md#constructor)

### Properties

- [address](GSCVault.md#address)
- [context](GSCVault.md#context)
- [dataSource](GSCVault.md#datasource)
- [name](GSCVault.md#name)

### Methods

- [getIdleDuration](GSCVault.md#getidleduration)
- [getIsIdle](GSCVault.md#getisidle)
- [getIsMember](GSCVault.md#getismember)
- [getJoinDate](GSCVault.md#getjoindate)
- [getMemberVaults](GSCVault.md#getmembervaults)
- [getMembers](GSCVault.md#getmembers)
- [getRequiredVotingPower](GSCVault.md#getrequiredvotingpower)
- [getTotalVotingPower](GSCVault.md#gettotalvotingpower)
- [getVoters](GSCVault.md#getvoters)
- [getVotingPower](GSCVault.md#getvotingpower)
- [getVotingPowerBreakdown](GSCVault.md#getvotingpowerbreakdown)
- [join](GSCVault.md#join)
- [kick](GSCVault.md#kick)

## Constructors

### constructor

• **new GSCVault**(`address`, `context`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |
| `options?` | [`GSCVaultOptions`](../interfaces/GSCVaultOptions.md) |

#### Overrides

[VotingVault](VotingVault.md).[constructor](VotingVault.md#constructor)

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:19](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L19)

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

• **dataSource**: [`GSCVaultContractDataSource`](GSCVaultContractDataSource.md)

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

### getIdleDuration

▸ **getIdleDuration**(): `Promise`<`number`\>

Get the time (in MS) that a new GSC member must wait after joining before
they can vote.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:81](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L81)

___

### getIsIdle

▸ **getIsIdle**(`address`): `Promise`<`boolean`\>

Get a boolean indicating whether a member is still in the idle duration.
Idle members cannot vote.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:89](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L89)

___

### getIsMember

▸ **getIsMember**(`address`): `Promise`<`boolean`\>

Get a boolean indicating whether a given address is a current member.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:73](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L73)

___

### getJoinDate

▸ **getJoinDate**(`address`): `Promise`<``null`` \| `Date`\>

Get the join date of a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null`` \| `Date`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:65](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L65)

___

### getMemberVaults

▸ **getMemberVaults**(`address`): `Promise`<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

Get the voting vaults a member joined with. Used to prove the member meets
the minimum voting power requirement.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>[]\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:102](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L102)

___

### getMembers

▸ **getMembers**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all current members of this vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | The block number to start searching for members from. |
| `toBlock?` | `number` | The block number to stop searching for members at. |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:48](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L48)

___

### getRequiredVotingPower

▸ **getRequiredVotingPower**(): `Promise`<`string`\>

Get the amount of voting power required to join this vault.

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:39](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L39)

___

### getTotalVotingPower

▸ `Optional` **getTotalVotingPower**(`atBlock?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `atBlock?` | `number` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[VotingVault](VotingVault.md).[getTotalVotingPower](VotingVault.md#gettotalvotingpower)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:38](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L38)

___

### getVoters

▸ **getVoters**(`fromBlock?`, `toBlock?`): `Promise`<[`Voter`](Voter.md)[]\>

Get all voters with voting power in this vault (alias for `getMembers`).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromBlock?` | `number` | The block number to start searching for voters from. |
| `toBlock?` | `number` | The block number to stop searching for voters at. |

#### Returns

`Promise`<[`Voter`](Voter.md)[]\>

#### Overrides

[VotingVault](VotingVault.md).[getVoters](VotingVault.md#getvoters)

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:58](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L58)

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

▸ `Optional` **getVotingPowerBreakdown**(`address?`, `fromBlock?`, `toBlock?`): `Promise`<`VoterPowerBreakdown`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `fromBlock?` | `number` |
| `toBlock?` | `number` |

#### Returns

`Promise`<`VoterPowerBreakdown`[]\>

#### Inherited from

[VotingVault](VotingVault.md).[getVotingPowerBreakdown](VotingVault.md#getvotingpowerbreakdown)

#### Defined in

[packages/council-sdk/src/models/votingVault/VotingVault.ts:33](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/VotingVault.ts#L33)

___

### join

▸ **join**(`signer`, `vaults`, `options?`): `Promise`<`string`\>

Become a member of this GSC vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the joining member. |
| `vaults` | (`string` \| [`VotingVault`](VotingVault.md)<[`VotingVaultDataSource`](../interfaces/VotingVaultDataSource.md)\>)[] | The addresses of the approved vaults the joining member has voting power in. This is used to prove the joining member meets the minimum voting power requirement. If voting power is moved to a different vault, the member will become ineligible until they join again with the new vault or risk being kicked. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:119](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L119)

___

### kick

▸ **kick**(`signer`, `member`, `options?`): `Promise`<`string`\>

Remove a member that's become ineligible from this GSC vault. A member
becomes ineligible when the voting power in the vaults they joined with
drops below the required minimum.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | The Signer of the wallet paying to kick. |
| `member` | `string` | The address of the ineligible member to kick. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) & { `extraVaultData?`: `BytesLike`[]  } | - |

#### Returns

`Promise`<`string`\>

The transaction hash.

#### Defined in

[packages/council-sdk/src/models/votingVault/GSCVault.ts:143](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/models/votingVault/GSCVault.ts#L143)
