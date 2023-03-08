import {
  CouncilContext,
  TransactionOptions,
  Voter,
  VotingVault,
} from "@council/sdk";
import { Signer } from "ethers";
import { Result, ScoreVaultDataSource } from "src/ScoreVaultDataSource";

export class ScoreVault extends VotingVault<ScoreVaultDataSource> {
  constructor(address: string, context: CouncilContext) {
    super(address, context, {
      name: "Score Vault",
      dataSource: context.registerDataSource(
        { address },
        new ScoreVaultDataSource(address, context)
      ),
    });
  }

  getScore(address: string) {
    return this.dataSource.getScore(address);
  }

  async getResults(
    address?: string,
    result?: Result,
    fromBlock?: number,
    toBlock?: number
  ) {
    const results = await this.dataSource.getResults(
      address,
      result,
      fromBlock,
      toBlock
    );
    return results.map(({ newScore, result, user }) => {
      return {
        newScore,
        result,
        user: new Voter(user, this.context),
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
    return this.dataSource.addResult(signer, address, result, points, options);
  }
}
