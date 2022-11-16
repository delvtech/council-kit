import { CouncilContext } from "src/context";
import { VotingVaultContractDataSource } from "src/datasources/VotingVault/VotingVaultContractDataSource";
import { VotingVaultDataSource } from "src/datasources/VotingVault/VotingVaultDataSource";
import { Model } from "src/models/Model";
import { Voter } from "src/models/Voter";

export interface VotingVaultOptions {
  name?: string;
  dataSource?: VotingVaultDataSource;
}

// Adds common methods as optional. This makes it possible to loop through a
// list of VotingVaults and conditionally call these methods without TypeScript
// complaining that the methods don't exist on type VotingVault.
interface VotingVaultModel {
  address: string;
  dataSource: VotingVaultDataSource;
  getVoters?(...args: any[]): Promise<Voter[]>;
  getTotalVotingPower?(...args: any[]): Promise<string>;
}
export interface VotingVault extends VotingVaultModel {}

export class VotingVault extends Model implements VotingVaultModel {
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
