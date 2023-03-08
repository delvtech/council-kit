import { CouncilContext, VotingVaultContractDataSource } from "@council/sdk";
import { ScoreVault, ScoreVault__factory } from "@example/typechain";
import { ScoreChangeEvent } from "@example/typechain/dist/ScoreVault";

const RESULTS = ["WIN", "LOSS"] as const;

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
    fromBlock?: number,
    toBlock?: number
  ): Promise<
    {
      user: string;
      result: typeof RESULTS[number];
      newScore: string;
    }[]
  > {
    const eventFilter = this.contract.filters.ScoreChange(address);
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
