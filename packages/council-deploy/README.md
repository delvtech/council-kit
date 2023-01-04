# @council/deploy

Scripts for deploying the Council contracts to your network of choice, i.e.:
`goerli` or `mainnet`.

## Principles

Setting up and deploying the Council contracts is a complex process that
requires doing things in a specific order. This project serves to be a reference
point for anyone looking to deploy their own version of Council.

You might not need every contract provided by Council. Perhaps you don't need a
GSC, Treasury, or a specific Voting Vault. You might already have a
voting token and don't need to deploy the one provided here. We intend to make
this customization process easy with different Recipes for common deployment
cases.

We also recommend that you deploy your Council contracts to `goerli` first to
resolve any issues before going live on `mainnet`.

## Installation

1. Clone the council-monorepo then run, `yarn install`.
2. Run `yarn workspace @council/deploy run build` to grab the latest contract code
   and build the project.
3. Add your environment variables to `packages/council-deploy/.env`. See the
   `.env.sample` in this project for a template.

## Deploy contracts

Contracts are deployed using the private key of the wallet specified in the `.env`
file, see: `GOERLI_DEPLOYER_PRIVATE_KEY`.

Once all contracts are deployed, each one will be verified on Etherscan
automatically. (Don't forget to add your `ETHERSCAN_API_KEY` to the .env file.)

The entire process takes around 10 minutes. This is because some contracts need
to interact with other contracts. It also takes a little extra time for
Etherscan to index new contracts before they can be verified.

### Goerli:

Run: `yarn workspace @council/deploy run goerli:deploy-contracts`

### Mainnet:

TBD

## Handy Scripts

Either for demo purposes or just general usefulness, there are a handful of CLI
scripts that can make life easier when working with the contracts.

### `yarn workspace @council/deploy run goerli:mint-voting-tokens`

Prompts for a wallet address and voting token, then mints and transfers a
specified amount of tokens.

### `yarn workspace @council/deploy run goerli:deposit-voting-tokens-into-locking-vault`

Prompts for a locking vault address, then transfers a specified amount of its
voting token from the user's wallet to the vault. If the wallet does not have
any of the voting token, it will prompt you to mint some.

## File Structure

All code that deploys, verifies, or interacts with the contracts
lives under `src/`.

When contracts are deployed, The network-specific `*.deployments.json` file
under `src/deployments` is updated with the contract deployment information.
This file has a strict JSONSchema and typescript types so it can be imported and
used safely in other projects. Deployments are checked into the repo since each
deployment is unique.

Each contract type, (eg: Timelock, Treasury, Voting Vaults) is treated as a
separate feature of Council, so each one lives in its own folder containing all
the necessary logic to deploy and interact with it. Some contracts like
`src/votingToken` are completely decoupled from all other contracts. Others,
like `src/vaults/lockingVault` are allowed to import from other folders where it
makes sense (In this example, the locking vault needs to know about the
votingToken).

Deployment of the entire set of Council contracts lives in
`src/deployCouncil.ts`. You are encouraged to read the heavily commented code
there to better understand how the contracts talk to each other during the
deployment process. This is also where you can modify the deployment process
based on what makes sense for your needs.

### Note about Proposals

If you need to test voting, then make sure you do this step AFTER your account
has vote power. To get vote power, deposit some of your tokens to the locking
vault through the UI.
