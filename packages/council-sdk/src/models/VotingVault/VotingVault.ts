import { BytesLike } from "ethers";
import { CouncilContext } from "src/context";
import { VotingVaultContractDataSource } from "src/datasources/VotingVault/VotingVaultContractDataSource";
import { VotingVaultDataSource } from "src/datasources/VotingVault/VotingVaultDataSource";
import { Model, ModelOptions } from "src/models/Model";
import { Voter } from "src/models/Voter";
import { VoterPowerBreakdown } from "src/models/VotingVault/types";

/**
 * @category Models
 */
export interface VotingVaultOptions<
  TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
> extends ModelOptions {
  /**
   * A data source to use instead of registering one with the `context`. If you
   * pass in a data source, you take over the responsibility of registering it
   * with the `context` to make it available to other models and data sources.
   */
  dataSource?: TDataSource;
}

// Adds common methods as optional. This makes it possible to loop through a
// list of VotingVaults and conditionally call these methods without TypeScript
// complaining that the methods don't exist on type VotingVault.
interface IVotingVault<
  TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
> {
  address: string;
  dataSource: TDataSource;
  getVoters?(...args: any[]): Promise<Voter[]>;
  getVotingPowerBreakdown?(...args: any[]): Promise<VoterPowerBreakdown[]>;
  getTotalVotingPower?(...args: any[]): Promise<string>;
}

// Include the common optional methods in the `VotingVault` export. The original
// interface name has to be different than the model name so that the model can
// implement it.
export interface VotingVault extends IVotingVault {}

/**
 * A vault which stores voting power by address
 * @category Models
 */
export class VotingVault<
    TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
  >
  extends Model
  implements IVotingVault
{
  address: string;
  dataSource: TDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    options?: VotingVaultOptions,
  ) {
    super(context, {
      ...options,
      name: options?.name ?? "Voting Vault",
    });
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
   * Get the usable voting power owned by a given address in this vault.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower(
    address: string,
    atBlock?: number,
    extraData: BytesLike = "0x00",
  ): Promise<string> {
    return this.dataSource.getVotingPower(address, atBlock, extraData);
  }
}
