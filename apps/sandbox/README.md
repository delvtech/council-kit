# council-sdk-starter

A reference project with example scripts using the council sdk.

- [Installation](#installation)
- [Getting started](#getting-started)
  - [Environment](#environment)
  - [Starting](#starting)
    - [Get Proposal Results](#get-proposal-results)
    - [Get GSC Members](#get-gsc-members)
    - [Create a Proposal](#create-a-proposal)
  - [Building](#building)

## Installation

The Council SDK isn't currently available as a stand alone package but can be installed within the council monorepo.

1. Clone the council-monorepo.
2. Add `"@council/sdk": "*"` to the app or package's package.json.
3. Run install: `yarn`.

## Getting started

### Environment

Create your own `.env`. An example template is included in the project in `.env.example`. Provide an RPC url and a private key to sign and pay for transactions.

### Starting

Multiple example scripts are included in [`src/scripts`](src/scripts). Each one has a corresponding npm script to run it.

#### Get Proposal Results

```
yarn workspace council-sdk-start getProposalResults
```

#### Get GSC Members

```
yarn workspace council-sdk-start getGSCMembers
```

#### Create a Proposal

_Caution! this will require paying gas._

```
yarn workspace council-sdk-start createProposal
```

### Building

```bash
yarn workspace council-sdk-starter build
```
