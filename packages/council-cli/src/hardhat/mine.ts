// import hre from 'hardhat';

// console.log

// interface MineOptions {
//   blocks: number;
//   rpcUrl: string;
// }

// /**
//  * Mine a given number of blocks on the local testnet
//  * @param blocks The number of blocks to mine
//  * @returns The new current block number
//  */
// export async function mine({ blocks, rpcUrl }: MineOptions): Promise<number> {
//   const publicClient = createPublicClient({
//     chain: hardhat,
//     transport: http(rpcUrl),
//   });

//   await publicClient.request({
//     // @ts-expect-error: evm_mine is not a valid method
//     method: "evm_mine",
//     // @ts-expect-error: Type '"evm_mine"' is not assignable to type
//     // '"eth_uninstallFilter"'
//     params: [blocks],
//   });

//   return Number(await publicClient.getBlockNumber());
// }
