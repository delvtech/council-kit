import { CouncilContext } from "src/context";
import { VotingVaultContractDataSource } from "src/datasources/VotingVault/VotingVaultContractDataSource";
import { VotingVaultDataSource } from "src/datasources/VotingVault/VotingVaultDataSource";
import { Model } from "src/models/Model";

export interface VotingVaultOptions {
  name?: string;
  dataSource?: VotingVaultDataSource;
}

export class VotingVault extends Model {
  address: string;
  dataSource: VotingVaultDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    options?: VotingVaultOptions,
  ) {
    super(context, options?.name ?? "Voting Vault");
    this.address = address;
    this.dataSource =
      options?.dataSource ||
      this.context.registerDataSource(
        {
          address,
        },
        new VotingVaultContractDataSource(address, context.provider),
      );
  }

  async getVotingPower(address: string, atBlock?: number): Promise<string> {
    return this.dataSource.getVotingPower(
      address,
      atBlock ?? (await this.context.provider.getBlockNumber()),
    );
  }
}
