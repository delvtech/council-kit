import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { Model, ReadModelOptions } from "src/entities/Model";
import { ReadVote } from "src/entities/ReadVote";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import { BlockLike } from "src/utils/blockToReadOptions";

export interface ReadVoterOptions extends ReadModelOptions {
  address: `0x${string}`;
}

/**
 * A participant in Council
 * @category Models
 */
export class ReadVoter extends Model {
  address: `0x${string}`;

  constructor({ address, name = `Voter`, ...rest }: ReadVoterOptions) {
    super({
      name,
      ...rest,
    });
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
          contractFactory: this.contractFactory,
          network: this.network,
        });
      }
      return vault.getVotingPower({
        account: this.address,
        atBlock,
        extraData: extraData?.[i],
      });
    });
    return (await Promise.all(vaultPowers)).reduce((sum, val) => sum + val, 0n);
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
    coreVoting: ReadCoreVoting | `0x${string}`;
    proposalId?: bigint;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<ReadVote[]> {
    const _coreVoting =
      typeof coreVoting === "string"
        ? new ReadCoreVoting({
            address: coreVoting,
            contractFactory: this.contractFactory,
            network: this.network,
          })
        : coreVoting;
    return _coreVoting.getVotes({
      proposalId,
      account: this,
      fromBlock,
      toBlock,
    });
  }

  /**
   * Get the number of proposals this Voter has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * this Voter has voted on every proposal they were able to.
   */
  async getParticipation({
    coreVoting,
    vaults,
    fromBlock,
    toBlock,
  }: {
    coreVoting: ReadCoreVoting | `0x${string}`;
    vaults: (ReadVotingVault | `0x${string}`)[];
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<[number, number]> {
    const _coreVoting =
      typeof coreVoting === "string"
        ? new ReadCoreVoting({
            address: coreVoting,
            contractFactory: this.contractFactory,
            network: this.network,
            vaults,
          })
        : coreVoting;
    return _coreVoting.getParticipation({
      account: this,
      fromBlock,
      toBlock,
    });
  }
}
