import { IVotingVault } from "@council/artifacts/dist/IVotingVault";
import { CachedReadContract } from "@council/evm-client";
import { BlockLike, blockToReadOptions } from "src/contract/args";
import { Model, ReadContractModelOptions } from "src/models/Model";

const votingVaultAbi = IVotingVault.abi;
type VotingVaultAbi = typeof votingVaultAbi;

/**
 * @category Models
 */
export interface ReadVotingVaultOptions extends ReadContractModelOptions {}

/**
 * A vault which stores voting power by address
 * @category Models
 */
export class ReadVotingVault extends Model {
  protected _contract: CachedReadContract<VotingVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    id,
    name,
  }: ReadVotingVaultOptions) {
    super({ name, network, contractFactory });
    this._contract = contractFactory({
      abi: votingVaultAbi,
      address,
      cache,
      id,
    });
  }

  get address(): string {
    return this._contract.address;
  }
  get id(): string {
    return this._contract.id;
  }

  /**
   * Get the usable voting power owned by a given address in this vault.
   * @param extraData - ABI encoded optional extra data used by some vaults,
   *   such as merkle proofs.
   */
  async getVotingPower({
    address,
    atBlock = "latest",
    extraData = "0x00",
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
    extraData?: `0x${string}`;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await this._network.getBlock(blockToReadOptions(atBlock));
      blockNumber = block.blockNumber;
    }

    return this._contract.simulateWrite("queryVotePower", {
      blockNumber,
      extraData,
      user: address,
    });
  }
}

// interface IVotingVault<
//   TDataSource extends VotingVaultDataSource = VotingVaultDataSource,
// > {
//   address: string;
//   dataSource: TDataSource;
//   getVoters?(fromBlock?: number, toBlock?: number): Promise<Voter[]>;
//   getVotingPowerBreakdown?(
//     address?: string,
//     fromBlock?: number,
//     toBlock?: number,
//   ): Promise<VoterPowerBreakdown[]>;
//   getTotalVotingPower?(atBlock?: number): Promise<string>;
// }

// Include the common optional methods in the `VotingVault` export. The original
// interface name has to be different than the model name so that the model can
// implement it.
// export interface VotingVault extends IVotingVault {}
