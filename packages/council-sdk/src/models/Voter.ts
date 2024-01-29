import { BlockLike } from "src/contract/args";
import { Model, ReadModelOptions } from "./Model";
import { Vote } from "./Vote";
import { VotingContract } from "./votingContract/VotingContract";
import { ReadVotingVault, VotingVault } from "./votingVault/VotingVault";

export interface ReadVoterOptions extends ReadModelOptions {
  address: `0x${string}`;
}

/**
 * A participant in Council
 * @category Models
 */
export class ReadVoter extends Model {
  address: `0x${string}`;

  constructor({ address, ...rest }: ReadVoterOptions) {
    super(rest);
    this.address = address;
  }

  /**
   * Get the total voting power for this Voter from a given list of vaults.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower({
    vaults,
    atBlock,
    extraData,
  }: {
    vaults: (`0x${string}` | ReadVotingVault)[];
    atBlock?: BlockLike;
    extraData?: `0x${string}`[];
  }): Promise<bigint> {
    const vaultPowers = vaults.map((vault, i) => {
      if (typeof vault === "string") {
        vault = new ReadVotingVault({
          address: vault,
          contractFactory: this._contractFactory,
          network: this._network,
        });
      }
      return vault.getVotingPower({
        address: this.address,
        atBlock,
        extraData: extraData?.[i],
      });
    });
    return (await Promise.all(vaultPowers)).reduce((sum, val) => sum + val);
  }

  /**
   * Get the casted votes for this Voter in a given Voting Contract
   */
  async getVotes(votingContractAddress: `0x${string}`): Promise<Vote[]> {
    const votingContract = new ReadVotingContract({
      address: votingContractAddress,
      contractFactory: this._contractFactory,
      network: this._network
    });
    return votingContract.getVotes({ voter: this.address });
  }

  /**
   * Get the number of proposals this Voter has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * this Voter has voted on every proposal they were able to.
   */
  async getParticipation(
    votingContractAddress: string,
    vaults: (string | VotingVault)[],
  ): Promise<[number, number]> {
    const votingContract = new VotingContract(
      votingContractAddress,
      vaults,
      this.context,
    );
    return await votingContract.getParticipation(this.address);
  }
}
