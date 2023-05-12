import { BytesLike, ethers } from "ethers";

/**
 * Create a call hash for the Timelock from a list of targets and calldatas
 */
export function createCallHash(
  targets: string[],
  callDatas: BytesLike[],
): string {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["address[]", "bytes[]"],
    [targets, callDatas],
  );
  return ethers.utils.keccak256(encoded);
}
