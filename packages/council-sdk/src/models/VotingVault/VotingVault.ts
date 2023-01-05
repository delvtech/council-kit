import { BytesLike } from "ethers";
import { CouncilContext } from "src/context";
import { VotingVaultContractDataSource } from "src/datasources/VotingVault/VotingVaultContractDataSource";
import { VotingVaultDataSource } from "src/datasources/VotingVault/VotingVaultDataSource";
import { Model } from "src/models/Model";
import { Voter } from "src/models/Voter";

export interface VotingVaultOptions<
  TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
> {
  name?: string;
  dataSource?: TDataSource;
}

// Adds common methods as optional. This makes it possible to loop through a
// list of VotingVaults and conditionally call these methods without TypeScript
// complaining that the methods don't exist on type VotingVault.
interface VotingVaultModel<
  TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
> {
  address: string;
  dataSource: TDataSource;
  getVoters?(...args: any[]): Promise<Voter[]>;
  getTotalVotingPower?(...args: any[]): Promise<string>;
}

// Include the common optional methods in the `VotingVault` export
export interface VotingVault extends VotingVaultModel {}

/**
 * A vault which stores voting power by address
 */
export class VotingVault<
    TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
  >
  extends Model
  implements VotingVaultModel
{
  address: string;
  dataSource: TDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    options?: VotingVaultOptions,
  ) {
    super(context, options?.name ?? "Voting Vault");
    this.address = address;
    this.dataSource = (options?.dataSource ||
      this.context.registerDataSource(
        {
          address,
        },
        new VotingVaultContractDataSource(address, context),
      )) as TDataSource;
  }

  /**
   * Get the voting power owned by a given address in this vault.
   * @param extraData ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower(
    address: string,
    atBlock?: number,
    extraData: BytesLike = "0x00",
  ): Promise<string> {
    return this.dataSource.getVotingPower(
      address,
      atBlock ?? (await this.context.provider.getBlockNumber()),
      extraData,
    );
  }
}
