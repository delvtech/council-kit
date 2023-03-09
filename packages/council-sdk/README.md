# Council SDK

A TypeScript SDK for interfacing with the [Council protocol](https://github.com/element-fi/council).

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Primary Concepts](#primary-concepts)
  - [Models](#models)
  - [Data Sources](#data-sources)
  - [Context](#context)
  - [Utils](#utils)
- [Extending](#extending)
  - [Adding a new Voting Vault](#adding-a-new-voting-vault)
- [Reference](#reference)
  - [Models](#models-1)
  - [Data Sources](#data-sources-1)
  - [Context](#context-1)
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

The SDK is made up of 4 main concepts:

- [Models](#models)
- [Data Sources](#data-sources)
- [Context](#context)
- [Utils (utilities)](#utils)

### Models

Models are the primary interface for the SDK. They're JavaScript classes that
represent specific entities within Council and include methods on them to fetch
data and submit transactions.

When possible, these data fetching methods will return other models. For
example, fetching a proposal from a `VotingContract` model will return a new
`Proposal` model instance with it's own methods. This makes it easy to work with
return values rather than just returning addresses or ids like you might expect
from an API.

```ts
// initiates a new VotingContract Model instance
const coreVoting = new VotingContract("0x0...", [], context);

// returns a new Proposal Model instance
const proposal0 = await coreVoting.getProposal(0);

// returns a plain string since there is no model for Quorum.
const quorum = await proposal.getCurrentQuorum();
```

For more info, checkout the [Models reference](#models-1).

### Data Sources

Data sources are JavaScript classes that act as an interchangeable data access layer for the models. They handle querying and caching logic so the models can just focus on defining the shape of Council entities and their relationships.

As an SDK user, you'll likely never touch the data sources directly. A basic data source takes arguments from a model, fetches and caches on-chain data, and returns it to the model for any further transformations or model construction.

Data sources return basic values and objects. They'll never return other data sources or models (class instances).

```ts
const coreVoting = new CoreVotingContractDataSource("0x...", context);

// returns a plain JavaScript object of data from the contract
const proposal = await coreVoting.getProposal(0);
```

For more info, checkout the [DataSources reference](#data-sources-1).

### Context

The [`CouncilContext`](docs/classes/CouncilContext.md) stores common information used in model and data source methods including shared data sources and their cache. It also includes a couple utility methods for getting and registering new shared data sources.

As an SDK user, you likely won't call any methods on the context. You'll just construct the Context and pass it to new Models.

```ts
const context = new CouncilContext(provider);
```

For more info, checkout the [CouncilContext reference](docs/classes//CouncilContext.md).

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

For more info, checkout the [Utils reference](#utils-1).

## Extending

The Council SDK is purpose built to be extended and modified in a number of ways. For example, you could change the data sources for your models, add new model variations (e.g., new vault types), extend existing models with custom methods, or even modify the way context manages shared data sources.

We'll cover a few common extensions/modifications we anticipate builders making here.

### Adding a new Voting Vault



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

### Context

- [`CouncilContext`](docs/classes//CouncilContext.md)

### Utils

- [`cached`](docs/modules.md#cached)
- [`cachedKey`](docs/modules.md#cachedkey)
- [`getBlockDate`](docs/modules.md#getblockdate)
- [`sumStrings`](docs/modules.md#sumstrings)
