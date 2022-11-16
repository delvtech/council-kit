import { UrlObject } from "url";

// WARN: Change prefix if forking application!
const prefix = "/council-monorepo";

function makeUrl(path: string) {
  return `${prefix}/${path}`;
}

export function makeVoterHref(address: string): UrlObject {
  return {
    pathname: makeUrl("voters/details"),
    query: {
      address,
    },
  };
}

export function makeProposalHref(id: string): UrlObject {
  return {
    pathname: makeUrl("proposals/details"),
    query: {
      id,
    },
  };
}

export function makeVaultHref(address: string): UrlObject {
  return {
    pathname: makeUrl("vaults/details"),
    query: {
      address,
    },
  };
}
