import { GetBlockParameters, INetwork } from "@council/evm-client";
import { PublicClient } from "viem";

export class ViemNetwork implements INetwork {
  private readonly _publicClient: PublicClient;

  constructor(publicClient: PublicClient) {
    this._publicClient = publicClient;
  }

  async getBlock(args: GetBlockParameters): Promise<{
    blockNumber: bigint;
    timestamp: bigint;
  }> {
    const block = await this._publicClient.getBlock(args);

    if (!block.number || !block.timestamp) {
      throw new Error(`Block not found for args: ${args}`);
    }

    return { blockNumber: block.number, timestamp: block.timestamp };
  }
}
