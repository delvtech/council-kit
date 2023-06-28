import {
  Address,
  encodeAbiParameters,
  Hex,
  keccak256,
  parseAbiParameters,
} from "viem";

/**
 * Create a call hash for the Timelock from a list of targets and calldatas
 */
export function createCallHash(
  targets: string[],
  callDatas: BytesLike[],
): string {
  const encoded = encodeAbiParameters(
    parseAbiParameters("address[], bytes[]"),
    [targets as Address[], callDatas as Hex[]],
  );
  return keccak256(encoded);
}

export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;

interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}
