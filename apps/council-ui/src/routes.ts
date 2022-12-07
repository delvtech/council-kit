import { UrlObject } from "url";

export enum Routes {
  VOTERS = "/voters",
  PROPOSALS = "/proposals",
  VAULTS = "/vaults",
}

export function makeProposalURL(
  votingContractAddress: string,
  id: number,
): UrlObject {
  return {
    pathname: "/proposals/details",
    query: {
      votingContract: votingContractAddress,
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
