# council-ui 🏛️

Council-ui is a reference frontend for DAOs built using the council framework using NextJS.

## Principles

This project tried to be as **un-opinionated** as possible, only picking popular libraries as dependencies, to encourage forking. Another founding principal for this project is to **minimize reliance on centralized servers**, meaning all data is loaded dynamically. Data fetching in the application could be optimized using an indexer or static data.

## Features

TODO

## Getting started

### Install dependencies

```bash
yarn
```

### Run the local server

```bash
yarn workspace council-ui dev
# or
yarn dev # uses turbo repo
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Linting

```bash
yarn workspace council-ui lint:check
yarn workspace council-ui lint
```

### Linting

```bash
yarn workspace council-ui format:check
yarn workspace council-ui format

```

## What's inside?

- **NextJS**- react framework
- **Tailwindcss** - component styling
- **DaisyUI** - handy tailwind utility classes
- **Rainbow-kit** - web3 wallet integration
- **wagmi** - web3 hooks
- **ens.js** - ens sdk for batch ens resolutions

## Production

This repository is pre-configured to be deployed using GitHub pages using a [custom action](). Furthermore, we've included some additional actions for CI code [linting]() and [formatting]90.

If you need a custom deployment you can build the bundle using the following commands. This project decided not to use any SSR for production deployments to minimize the reliance on centralized servers.

### Build and export the bundle

```bash
yarn workspace council-ui build

yarn workspace council-ui export
```

The production bundle can be viewed at `/out`.

## Learn More

To learn more about council, take a look at the following resources:

- [council](https://nextjs.org/docs) - view the council smart contracts.
- [Learn about Council]() - documentation over the building blocks of council.
