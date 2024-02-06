import hre from "hardhat";

interface MineOptions {
  blocks: number;
  rpcUrl: string;
}

/**
 * Mine a given number of blocks on the local testnet
 * @param blocks The number of blocks to mine
 * @returns The new current block number
 */
export async function mine({ blocks }: MineOptions): Promise<number> {
  const blockHex = `0x${blocks.toString(16)}`;
  hre.network.provider.send("hardhat_mine", [blockHex]);
  return hre.network.provider.send("eth_blockNumber");

  // const publicClient = createPublicClient({
  //   chain: hardhat,
  //   transport: http(rpcUrl),
  // });

  // await publicClient.request({
  //   // @ts-expect-error: evm_mine is not a valid method
  //   method: "evm_mine",
  //   // @ts-expect-error: Type '"evm_mine"' is not assignable to type
  //   // '"eth_uninstallFilter"'
  //   params: [blocks],
  // });

  // return Number(await publicClient.getBlockNumber());
}
