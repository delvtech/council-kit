import { UrlObject } from "url";

export enum Routes {
  VOTERS = "/voters",
  PROPOSALS = "/proposals",
  VAULTS = "/vaults",
}

export function makeProposalURL(id: string): UrlObject {
  return {
    pathname: "/proposals/details",
    query: {
      id,
    },
  };
}

export function makeVaultURL(address: string): UrlObject {
  return {
    pathname: "/vaults/details",
    query: {
      address,
    },
  };
}

export function makeVoterURL(address: string): UrlObject {
  return {
    pathname: "/voters/details",
    query: {
      address,
    },
  };
}
