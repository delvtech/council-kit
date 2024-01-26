import { Abi } from "abitype";
import { ICachedReadContract } from "src/contract/cached/CachedReadContract/CachedReadContract";
import { ICachedReadWriteContract } from "src/contract/cached/CachedReadWriteContract";

export type ICachedContract<TAbi extends Abi = Abi> =
  | ICachedReadContract<TAbi>
  | ICachedReadWriteContract<TAbi>;
