# council-sdk-starter

A reference project using the council sdk.

- [Installation](#installation)
- [Getting started](#getting-started)

## Installation

The Council SDK isn't currently available as a stand alone package but can be installed within the council monorepo.

1. Clone the council-monorepo.
2. Add `"@council/sdk": "*"` to the app or package's package.json.
3. Run install: `yarn`.

## Getting started

### Environment

Create your own `.env`. An example template is included in the project in `.env.example`. Provide an RPC url and the private key for an account (Be careful to not use a personal account with any funds).

### Starting

```bash
yarn workspace council-sdk-starter start
```

### Building

```bash
yarn workspace council-sdk-starter build
```

## Demo

This project has one entry file, `index.ts`. This file is configured as the entry point for the project build and example script. Currenly the file uses some of the sdk's models to read some data from the council protocol on mainnet.
