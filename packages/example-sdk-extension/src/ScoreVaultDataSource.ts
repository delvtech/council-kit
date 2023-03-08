import {
  CouncilContext,
  TransactionOptions,
  VotingVaultContractDataSource,
} from "@council/sdk";
import { ScoreVault, ScoreVault__factory } from "@example/typechain";
import { ScoreChangeEvent } from "@example/typechain/dist/ScoreVault.sol/ScoreVault";
import { BigNumber, Signer } from "ethers";

const RESULTS = ["WIN", "LOSS"] as const;
export type Result = typeof RESULTS[number];

export class ScoreVaultDataSource extends VotingVaultContractDataSource<ScoreVault> {
  constructor(address: string, context: CouncilContext) {
    super(ScoreVault__factory.connect(address, context.provider), context);
  }

  async getScore(address: string) {
    const scoreBigNumber = await this.call("scores", [address]);
    return scoreBigNumber.toString();
  }

  async getResults(
    address?: string,
    result?: Result,
    fromBlock?: number,
    toBlock?: number
  ) {
    const resultIndex = result && RESULTS.indexOf(result);
    const eventFilter = this.contract.filters.ScoreChange(address, resultIndex);
    const scoreChangeEvents: ScoreChangeEvent[] = await this.getEvents(
      eventFilter,
      fromBlock,
      toBlock
    );
    return scoreChangeEvents.map((event) => {
      return {
        user: event.args.user,
        result: RESULTS[event.args.result],
        newScore: event.args.newScore.toString(),
      };
    });
  }

  async addResult(
    signer: Signer,
    address: string,
    result: Result,
    points: Number,
    options?: TransactionOptions
  ) {
    const transaction = await this.callWithSigner(
      "addResult",
      [address, RESULTS.indexOf(result), BigNumber.from(points)],
      signer,
      options
    );
    this.clearCached();
    return transaction.hash;
  }
}
