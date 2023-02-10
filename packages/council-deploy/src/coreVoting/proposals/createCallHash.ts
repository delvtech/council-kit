import { BytesLike, ethers } from "ethers";

export async function createProposalCallHash(
  calldata: BytesLike[],
  targets: string[],
): Promise<string> {
  const toBeHashed = ethers.utils.defaultAbiCoder.encode(
    ["address[]", "bytes[]"],
    [targets, calldata],
  );
  return ethers.utils.keccak256(toBeHashed);
}
