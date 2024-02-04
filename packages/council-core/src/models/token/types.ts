import { MockERC20 } from "@council/artifacts/dist/MockERC20";

// Using MockERC20 abi for convenience to make extending to the MockToken model
// more straightforward without having to keep track of two different abis.
export type ERC20Abi = typeof MockERC20.abi;
