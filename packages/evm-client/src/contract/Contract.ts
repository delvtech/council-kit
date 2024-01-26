import { Abi } from "abitype";
import { IReadContract } from "./IReadContract";
import { IReadWriteContract } from "./IReadWriteContract";

/**
 * An abstracted contract interface to allow interchangeable web3 libraries.
 * Designed to be used by consumers that care about the interface of a contract,
 * but aren't necessarily concerned with where it's deployed or how it connects.
 */
export type Contract<TAbi extends Abi = Abi> =
  | IReadContract<TAbi>
  | IReadWriteContract<TAbi>;
