import {
  CouncilContext,
  TransactionOptions,
  VotingVaultContractDataSource,
} from "@council/sdk";
import { ScoreVault, ScoreVault__factory } from "@foolabs/typechain";
import { NewResultEvent } from "@foolabs/typechain/dist/ScoreVault.sol/ScoreVault";
import { BigNumber, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";

const RESULTS = ["WIN", "LOSS"] as const;
export type Result = typeof RESULTS[number];

export class ScoreVaultDataSource extends VotingVaultContractDataSource<ScoreVault> {
  constructor(address: string, context: CouncilContext) {
    super(ScoreVault__factory.connect(address, context.provider), context);
  }

  async getResults(
    address?: string,
    result?: Result,
    fromBlock?: number,
    toBlock?: number,
  ) {
    const resultIndex = result && RESULTS.indexOf(result);
    const eventFilter = this.contract.filters.NewResult(address, resultIndex);
    const scoreChangeEvents: NewResultEvent[] = await this.getEvents(
      eventFilter,
      fromBlock,
      toBlock,
    );
    return scoreChangeEvents.map((event) => {
      const { user, result, points } = event.args;
      return {
        user: user,
        result: RESULTS[result],
        points: formatEther(points),
      };
    });
  }

  async addResult(
    signer: Signer,
    address: string,
    result: Result,
    points: BigNumber,
    options?: TransactionOptions,
  ) {
    const transaction = await this.callWithSigner(
      "addResult",
      [address, RESULTS.indexOf(result), BigNumber.from(points)],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }
}
