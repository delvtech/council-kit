import { GetBlockOptions, Network, Transaction } from "@council/evm-client";
import { PublicClient, rpcTransactionType, TransactionLegacy } from "viem";

export class ViemNetwork implements Network {
  publicClient: PublicClient;

  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
  }

  async getBlock(args: GetBlockOptions): Promise<{
    blockNumber: bigint;
    timestamp: bigint;
  }> {
    const block = await this.publicClient.getBlock(args);

    if (!block.number || !block.timestamp) {
      throw new Error(`Block not found for args: ${args}`);
    }

    return { blockNumber: block.number, timestamp: block.timestamp };
  }

  async getTransaction({
    hash,
  }: {
    hash: `0x${string}`;
  }): Promise<Transaction> {
    const {
      blockHash,
      blockNumber,
      from,
      gas,
      gasPrice,
      input,
      nonce,
      to,
      transactionIndex,
      type,
      value,
      chainId,
    } = (await this.publicClient.getTransaction({
      hash,
    })) as TransactionLegacy;

    return {
      gas,
      gasPrice,
      input,
      nonce,
      type: rpcTransactionType[type],
      value,
      blockHash: blockHash ?? undefined,
      blockNumber: blockNumber ?? undefined,
      from,
      chainId,
      hash,
      to,
      transactionIndex: transactionIndex ?? undefined,
    };
  }
}
