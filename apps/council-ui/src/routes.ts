import { UrlObject } from "url";

export enum Routes {
  VOTERS = "/voters",
  PROPOSALS = "/proposals",
  VAULTS = "/vaults",
}

export function makeProposalURL(
  votingContractAddress: `0x${string}`,
  id: bigint | number,
): UrlObject {
  return {
    pathname: "/proposals/details",
    query: {
      votingContract: votingContractAddress,
      id: String(id),
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
