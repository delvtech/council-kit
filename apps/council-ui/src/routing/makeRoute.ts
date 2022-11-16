import { UrlObject } from "url";

export function makeVoterHref(address: string): UrlObject {
  return {
    pathname: "/voters/details",
    query: {
      address,
    },
  };
}

export function makeProposalHref(id: string): UrlObject {
  return {
    pathname: "/proposals/details",
    query: {
      id,
    },
  };
}

export function makeVaultHref(address: string): UrlObject {
  return {
    pathname: "/vaults/details",
    query: {
      address,
    },
  };
}
