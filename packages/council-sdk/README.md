# Council SDK

A JavaScript SDK for interfacing with the [Council protocol](https://github.com/element-fi/council).

- [Council SDK](#council-sdk)
  - [Example](#example)
  - [Primary Concepts](#primary-concepts)
    - [Models](#models)
    - [Data Sources](#data-sources)
    - [Context](#context)
    - [Utils](#utils)
  - [Context](#context-1)
  - [Council Models](#council-models)
    - [`VotingContract`](#votingcontract)
    - [`VotingVault`](#votingvault)
    - [`Proposal`](#proposal)
    - [`Vote`](#vote)
    - [`Voter`](#voter)
    - [`Token`](#token)
  - [DataSources](#datasources)
    - [`VotingContractDataSource`](#votingcontractdatasource)
    - [`VotingVaultDataSource`](#votingvaultdatasource)
    - [`ContractDataSource`](#contractdatasource)
    - [`HTTPDataSource`](#httpdatasource)
    - [`CachedDataSource`](#cacheddatasource)
  - [Utils](#utils-1)
    - [`cached`](#cached)
    - [`getBlockDate`](#getblockdate)
    - [`sumStrings`](#sumstrings)

## Example

```typescript
import { providers } from "ethers";
import {
  CouncilContext,
  LockingVault,
  VestingVault,
  VotingContract,
} from "@council/sdk";

async function main() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const context = new CouncilContext(provider);

  const lockingVault = new LockingVault("0x...", context);
  const vestingVault = new VestingVault("0x...", context);
  const coreVoting = new VotingContract(
    "0x0...",
    [lockingVault, vestingVault],
    context,
  );

  const proposals = await coreVoting.getProposals();
  for (const proposal of proposals) {
    console.log(await proposal.getResults());
  }
}

main();
```

## Primary Concepts

### Models

Models are the primary interface for the SDK. They are JavaScript classes with
methods on them to fetch data and initiate transactions.

```typescript
import { providers } from "ethers";
import { CouncilContext, LockingVault } from "@council/sdk";

async function main() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const context = new CouncilContext(provider);

  const lockingVault = new LockingVault("0x...", context);
  const token = await lockingVault.getToken();

  console.log(token);
  // Token { ... }

  const balance = await token.getBalanceOf("0x...");

  console.log(balance);
  // "500.0867"
}

main();
```

### Data Sources

Data Sources are JavaScript classes that act as an interchangeable data access
layer for the Models. They handle querying and caching logic so the models can
just focus on defining Council entities and their relationships.

```typescript
import { providers } from "ethers";
import { LockingVaultContractDataSource } from "@council/sdk";

async function main() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");

  const lockingVault = new LockingVaultContractDataSource("0x...", provider);
  const token = await lockingVault.getToken();

  // data sources return simple values or objects unlike models which can return other model instances
  console.log(token);
  // '0x...'
}

main();
```

### Context

The Context stores information about the context in which models are created and used including shared data sources and their cache. It also includes a couple utility methods for getting and registering new shared data sources.

### Utils

Utils are functions for common operations performed when building with the Council SDK.

## Context

## Council Models

### `VotingContract`

### `VotingVault`

### `Proposal`

### `Vote`

### `Voter`

### `Token`

## DataSources

### `VotingContractDataSource`

### `VotingVaultDataSource`

### `ContractDataSource`

### `HTTPDataSource`

### `CachedDataSource`

## Utils

### `cached`

### `getBlockDate`

### `sumStrings`
