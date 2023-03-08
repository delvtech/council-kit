import { CouncilContext, VotingVaultContractDataSource } from "@council/sdk";
import { ScoreVault, ScoreVault__factory } from "@example/typechain";
import { ScoreChangeEvent } from "@example/typechain/dist/ScoreVault";

const RESULTS = ["WIN", "LOSS"] as const;
type Result = typeof RESULTS[number];

export class ScoreVaultDataSource extends VotingVaultContractDataSource<ScoreVault> {
  constructor(address: string, context: CouncilContext) {
    super(ScoreVault__factory.connect(address, context.provider), context);
  }

  async getScore(address: string): Promise<string> {
    const scoreBigNumber = await this.call("scores", [address]);
    return scoreBigNumber.toString();
  }

  async getResults(
    address?: string,
    result?: Result,
    fromBlock?: number,
    toBlock?: number
  ): Promise<
    {
      user: string;
      result: Result;
      newScore: string;
    }[]
  > {
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
}
