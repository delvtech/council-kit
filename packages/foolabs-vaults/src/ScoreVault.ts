import {
  CouncilContext,
  TransactionOptions,
  Voter,
  VotingVault,
} from "@council/sdk";
import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { Result, ScoreVaultDataSource } from "src/ScoreVaultDataSource";

export class ScoreVault extends VotingVault<ScoreVaultDataSource> {
  constructor(address: string, context: CouncilContext) {
    super(address, context, {
      name: "Score Vault",
      dataSource: context.registerDataSource(
        { address },
        new ScoreVaultDataSource(address, context),
      ),
    });
  }

  async getResults(
    address?: string,
    result?: Result,
    fromBlock?: number,
    toBlock?: number,
  ) {
    const results = await this.dataSource.getResults(
      address,
      result,
      fromBlock,
      toBlock,
    );
    return results.map(({ points, result, user }) => {
      return {
        points,
        result,
        user: new Voter(user, this.context),
      };
    });
  }

  async addWin(
    address: string,
    points: number | string,
    signer: Signer,
    options?: TransactionOptions,
  ) {
    return this.dataSource.addResult(
      signer,
      address,
      "WIN",
      parseEther(points.toString()),
      options,
    );
  }

  async addLoss(
    address: string,
    points: number | string,
    signer: Signer,
    options?: TransactionOptions,
  ) {
    return this.dataSource.addResult(
      signer,
      address,
      "LOSS",
      parseEther(points.toString()),
      options,
    );
  }
}
