# Council Kit Sandbox

A sandbox to try out [Council Kit packages](../../packages).

## Getting started

### Environment

Create your own `.env` using [`.env.example`](.env.example) for reference.

### Running

Edit the code in [`src/sandbox.ts`](src/sandbox.ts) then run:

```bash
yarn workspace sandbox dev

# or to run on save:
yarn workspace sandbox watch
```

Example scripts can be found in [`src/scripts`](src/scripts). Each one has a corresponding [package.json](package.json) script to run it.

For example:

```bash
yarn workspace sandbox getProposalResults
```
