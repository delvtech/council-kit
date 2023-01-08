# Council SDK

A JavaScript SDK for interfacing with the [Council protocol](https://github.com/element-fi/council).

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Primary Concepts](#primary-concepts)
  - [Models](#models)
  - [Data Sources](#data-sources)
  - [Context](#context)
  - [Utils](#utils)
- [Reference](#reference)
  - [Models](#models-1)
  - [Data Sources](#data-sources-1)
  - [Utils](#utils-1)


## Installation

The Council SDK isn't currently available as a stand alone package but can be installed within the council monorepo.

1. Clone the council-monorepo.
2. Add `"@council/sdk": "*"` to the app or package's package.json.
3. Run install: `yarn`.

## Basic Usage

```ts
import { providers } from "ethers";
import { CouncilContext, VotingContract } from "@council/sdk";

const provider = new providers.JsonRpcProvider("http://localhost:8545");

// 1. Create a new context instance
const context = new CouncilContext(provider);

// 2. Create model instances
const coreVoting = new VotingContract("0x0...", [], context);

// 3. Call methods on the models
const aliceVotes = coreVoting.getVotes("0x...");
```

## Primary Concepts

The SDK is made up of 4 main concepts, [Models](#models), [Data Sources](#data-sources), [Context](#context), and [Utils (utilities)](#utils).

### Models

Models are the primary interface for the SDK. They're JavaScript classes with methods on them to fetch data and submit transactions. It's common for these methods to return other models themselves where it makes sense. For example, fetching a proposal from a `VotingContract` model will return a new `Proposal` model instance with it's own methods.

```ts
// initiates a new VotingContract Model instance
const coreVoting = new VotingContract("0x0...", [], context);

// returns a new Proposal Model instance
const proposal0 = await coreVoting.getProposal(0);

// returns a plain string
const quorum = await proposal.getCurrentQuorum();
```

### Data Sources

Data sources are JavaScript classes that act as an interchangeable data access layer for the models. They handle querying and caching logic so the models can just focus on defining the shape of Council entities and their relationships.

Data sources return basic values and objects. They'll never return other data sources or models (class instances).

```ts
const coreVoting = new CoreVotingContractDataSource("0x...", context);

// returns a plain JavaScript object of data from the contract
const proposal = await coreVoting.getProposal(0);
```

### Context

The [`CouncilContext`](docs/classes/CouncilContext.md) stores common information used in model and data source methods including shared data sources and their cache. It also includes a couple utility methods for getting and registering new shared data sources.

```ts
const context = new CouncilContext(provider);
```

### Utils

Utils are functions for common operations performed when building with the Council SDK.

```ts
// Turn a block number into a Date object with the getBlockDate util.
const blockDate = getBlockDate(minedBlockNumber, provider);

// Estimate future dates (e.g., expiration dates) with the estimateFutureDates option.
const estimatedDate = getBlockDate(futureBlockNumber, provider, {
  estimateFutureDates: true,
});
```

## Reference

### Models

- [`VotingContract`](docs/classes/VotingContract.md)
  - [`GSCVotingContract`](docs/classes/GSCVotingContract.md)
- [`VotingVault`](docs/classes/VotingVault.md)
  - [`LockingVault`](docs/classes/LockingVault.md)
  - [`VestingVault`](docs/classes/VestingVault.md)
  - [`GSCVault`](docs/classes/GSCVault.md)
- [`Proposal`](docs/classes/Proposal.md)
- [`Token`](docs/classes/Token.md)
- [`Vote`](docs/classes/Vote.md)
- [`Voter`](docs/classes/Voter.md)

### Data Sources

- [`CachedDataSource`](docs/classes/CachedDataSource.md)
  - [`ContractDataSource`](docs/classes/ContractDataSource.md)
    - [`CoreVotingContractDataSource`](docs/classes/CoreVotingContractDataSource.md)
    - [`VotingVaultContractDataSource`](docs/classes/VotingVaultContractDataSource.md)
      - [`LockingVaultContractDataSource`](docs/classes/LockingVaultContractDataSource.md)
      - [`VestingVaultContractDataSource`](docs/classes/VestingVaultContractDataSource.md)
      - [`GSCVaultContractDataSource`](docs/classes/GSCVaultContractDataSource.md)
    - [`ERC20ContractDataSource`](docs/classes/ERC20ContractDataSource.md)
  - [`HTTPDataSource`](docs/classes/HTTPDataSource.md)

### Utils

- [`cached`](docs/modules.md#cached)
- [`cachedkey`](docs/modules.md#cachedkey)
- [`getblockdate`](docs/modules.md#getblockdate)
- [`sumstrings`](docs/modules.md#sumstrings)
