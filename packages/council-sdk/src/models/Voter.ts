import { BlockLike } from "src/contract/args";
import { Model, ReadModelOptions } from "src/models/Model";
import { ReadVote } from "src/models/Vote";
import { ReadVotingVault } from "src/models/VotingVault/VotingVault";
import { ReadCoreVoting } from "..";

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
    vaults: (ReadVotingVault | `0x${string}`)[];
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
        voter: this.address,
        atBlock,
        extraData: extraData?.[i],
      });
    });
    return (await Promise.all(vaultPowers)).reduce((sum, val) => sum + val);
  }

  /**
   * Get the casted votes for this Voter in a given Voting Contract
   */
  async getVotes({
    coreVoting,
    proposalId,
    fromBlock,
    toBlock,
  }: {
    coreVoting: `0x${string}`;
    proposalId?: bigint;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<ReadVote[]> {
    const _coreVoting =
      typeof coreVoting === "string"
        ? new ReadCoreVoting({
            address: coreVoting,
            contractFactory: this._contractFactory,
            network: this._network,
          })
        : coreVoting;
    return _coreVoting.getVotes({
      proposalId,
      voter: this,
      fromBlock,
      toBlock,
    });
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
