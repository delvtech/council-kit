import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { FunctionReturn } from "@delvtech/evm-client";

export type VestingVaultAbi = typeof VestingVault.abi;
export type Grant = FunctionReturn<VestingVaultAbi, "getGrant">;
