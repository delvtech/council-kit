# council-ui

Council UI is a reference user interface for the Council protocol. This project utilizes the Council SDK for read and write calls to the blockchain. A NextJS based project.

## What's inside?

| Name                                                        | Description                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [NextJS](https://github.com/vercel/next.js/)                | React framework enabling applications with server-side rendering and generating static websites. |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Open source CSS framework for inline component styling.                                          |
| [DaisyUI](https://github.com/saadeghi/daisyui)              | Popular Tailwind CSS component library.                                                          |
| [wagmi](https://github.com/wagmi-dev/wagmi)                 | React Hooks for Ethereum.                                                                        |
| [ENS.js](https://github.com/ensdomains/ensjs-v3)            | ENS JavaScript library.                                                                          |

## Getting started

This guide is under the assumption of being in the `council-kit `monorepo.

### Install dependencies

```bash
yarn
```

### Run the development server

```bash
yarn workspace council-ui dev
```

### Run the development server

```bash
yarn workspace council-ui dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Linting

```bash
yarn workspace council-ui lint:check
yarn workspace council-ui lint # writes fixes to file
```

### Formatting

```bash
yarn workspace council-ui format:check
yarn workspace council-ui format # write to files
```

## Production

This project is configured to be deployed using GitHub pages using a [custom action](https://github.com/delvtech/council-kit/blob/main/.github/workflows/gh-pages-council.yml). Furthermore, we've included some additional actions for CI code [linting](https://github.com/delvtech/council-kit/blob/main/.github/workflows/lint.yml) and [formatting](https://github.com/delvtech/council-kit/blob/main/.github/workflows/format.yml).

If you need a custom deployment you can build the bundle using the following commands.

### Build and export the bundle

```bash
yarn workspace council-ui build # build the project

yarn workspace council-ui export # export the static site bundle
```

The production output can be viewed at `/out`.

## Council Config

Configuration files for this project reside in `/src/config`. This project is pre-configured for Goerli and Mainnet networks. This configuration can be expanded to include additional static data if needed.

As one of our guiding principles for this project was to not rely on centralized servers. Some important data for proposals and voting vaults do not exist on chain and must be configured manually such as the list of approved vaults and proposal metadata (title, description, etc).

Each supported network has it's own configuration file. Each configuration file is an object that is keyed by the voting contract name. In the provided configuration example there are two voting contracts: `core voting` and `gsc voting`.

### Adding new proposal data

When a new proposal is added on chain the metadata for the proposal needs to be added to the `proposals` value in the respective voting contract object. This is an object that is keyed by the proposal id (assigned on-chain).

```ts
{
  // other proposals here...
  5: {
  descriptionURL: "https://moreinfo.com",
  targets: [], // not used for now
  calldatas: [], // not used for now
  title: "EGP-69: Proposal to do the new cool thing!",
  sentenceSummary: "We like to be cutting edge so here is the next big thing.",
  paragraphSummary:
    "As of today, it is the best interested in the DAO to become cool. This proposal will achieve making is cool again...",
},
}
```

### Adding new voting vault

When a new voting vault is approved by a voting contract it must be added to the configuration file. In the `vaults` value of a voting contract object, append the following information:

```ts
vaults: [
  // other vaults here...
  {
    name: "New Vault",
    paragraphSummary: "A New Vault that does the approved thing...",
    address: "0x...",
    type: "NewVault",
    abi: {},
    descriptionURL: "https://moreinfo.com",
  }
],
```

## Optimization

This project strives to provide a solid reference user interface for developers. Since this project is designed to be **forked**, we did not integrate any indexers and solely rely on reading data from RPCs or from the configuration file(s). Many queries can be optimized for reduced RPC load and shorter latency by using an indexer or expanding the static data pipeline.
