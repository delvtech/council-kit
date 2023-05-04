@council/sdk / [Exports](modules.md)

# Council SDK

A TypeScript SDK built with [ethers v5](https://docs.ethers.org/v5/) for interfacing with the [Council protocol](https://github.com/delvtech/council).

> _[Ethers v6](https://docs.ethers.org/v6/) and/or [viem](https://github.com/wagmi-dev/viem) support TBD soon._

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

The Council SDK is purpose built to be extended and modified in a number of ways. Some examples of what you could do:

- Initiate models with a custom data source
- Add new model variations (e.g., new vault types)
- Extend existing models with custom properties or methods
- Modify the way context manages shared data sources.

The Council Kit monorepo is a great starting point to get all the src code including packages that haven't been published to a registry yet. However, making modifications directly to the source code can make it difficult to upgrade to newer versions. Extensions should be made either in a new package such as `@myprotocol/council-vaults` or inside app code.

Once version 1.0.0 of the sdk has been published to NPM, this package can be removed from the monorepo and the version updated in dependent apps and packages from `*` to `^1.0.0`.

### Adding a new Voting Vault

For this guide we'll assume you've already generated an [ethers v5 typechain](https://github.com/dethcrypto/TypeChain/tree/@typechain/ethers-v5@10.2.0/packages/target-ethers-v5) instances for your voting vault. See [@council/typechain](https://github.com/delvtech/council-kit/tree/main/packages/council-typechain) for an example.

**1. Create a new DataSource class**

To fetch data from the custom vault, add a new `DataSource` class for it.

```ts
import { FooVault, FooVault__factory } from "@foo/typechain";
import { CouncilContext, VotingVaultContractDataSource } from "@council/sdk";

// Extend the `VotingVaultContractDataSource` class to get data from on chain
// and inherit the `queryVotePower` method.
export class FooVaultDataSource extends VotingVaultContractDataSource<FooVault> {
  constructor(address: string, context: CouncilContext) {
    super(FooVault__factory.connect(address, context.provider), context);
  }

  // Add some custom data fetching methods taking advantage of util methods on
  // the super class like `this.call()` and `this.getEvents()`
  getAmount(address: string) {
    const [amount, delegate] = this.call("amount", [address]);
    return {
      amount: amount.toString(),
      delegate,
    };
  }
}
```

**2. Create the Model class**

Create a new `Model` class to transform some values into other `Model` instances and make it possible to initiate many model instances in different parts of the code that will all share the same data source instance and its cached data.

```ts
import { Voter } from "@council.typechain";
import { FooVaultDataSouce } from "./FooVaultDataSouce";

export class FooVault extends VotingVault<FooVaultDataSource> {
  constructor(address: string, context: CouncilContext) {
    super(address, context, {
      name: "Foo Vault",
      dataSource: context.registerDataSource(
        { address },
        new FooVaultDataSource(address, context),
      ),
    });
  }

  // add some methods to use in an app
  async getAmount() {
    const { amount, delegate } = this.dataSource.getAmount();
    return {
      amount,
      delegate: new Voter(delegate, this.context.provider),
    };
  }
}
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

### Context

- [`CouncilContext`](docs/classes//CouncilContext.md)

### Utils

- [`cached`](docs/modules.md#cached)
- [`cachedKey`](docs/modules.md#cachedkey)
- [`getBlockDate`](docs/modules.md#getblockdate)
- [`sumStrings`](docs/modules.md#sumstrings)
