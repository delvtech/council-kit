[@council/sdk](../README.md) / [Exports](../modules.md) / VoterPowerBreakdown

# Interface: VoterPowerBreakdown

## Hierarchy

- [`VoterWithPower`](VoterWithPower.md)

  ↳ **`VoterPowerBreakdown`**

## Table of contents

### Properties

- [delegators](VoterPowerBreakdown.md#delegators)
- [voter](VoterPowerBreakdown.md#voter)
- [votingPower](VoterPowerBreakdown.md#votingpower)
- [votingPowerFromDelegators](VoterPowerBreakdown.md#votingpowerfromdelegators)

## Properties

### delegators

• **delegators**: [`VoterWithPower`](VoterWithPower.md)[]

All wallets delegated to this voter with the power they're delegating. Does
not include self-delegation.

#### Defined in

[packages/council-sdk/src/models/votingVault/types.ts:18](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/models/votingVault/types.ts#L18)

___

### voter

• **voter**: [`Voter`](../classes/Voter.md)

#### Inherited from

[VoterWithPower](VoterWithPower.md).[voter](VoterWithPower.md#voter)

#### Defined in

[packages/council-sdk/src/models/votingVault/types.ts:4](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/models/votingVault/types.ts#L4)

___

### votingPower

• **votingPower**: `string`

#### Inherited from

[VoterWithPower](VoterWithPower.md).[votingPower](VoterWithPower.md#votingpower)

#### Defined in

[packages/council-sdk/src/models/votingVault/types.ts:5](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/models/votingVault/types.ts#L5)

___

### votingPowerFromDelegators

• **votingPowerFromDelegators**: `string`

The total voting power from all wallets delegated to this voter. Does not
include self-delegation.

#### Defined in

[packages/council-sdk/src/models/votingVault/types.ts:13](https://github.com/element-fi/council-monorepo/blob/8fd0879/packages/council-sdk/src/models/votingVault/types.ts#L13)
