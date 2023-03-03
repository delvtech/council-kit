import { BytesLike } from "ethers";
import { CouncilContext } from "src/context";
import { sumStrings } from "src/utils/sumStrings";
import { Model, ModelOptions } from "./Model";
import { Vote } from "./Vote";
import { VotingContract } from "./VotingContract/VotingContract";
import { VotingVault } from "./VotingVault/VotingVault";

/**
 * A participant in Council
 * @category Models
 */
export class Voter extends Model {
  address: string;

  constructor(
    address: string,
    context: CouncilContext,
    options?: ModelOptions,
  ) {
    super(context, options);
    this.address = address;
  }

  /**
   * Get the total voting power for this Voter from a given list of vaults.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower(
    vaults: (string | VotingVault)[],
    atBlock?: number,
    extraData?: BytesLike[],
  ): Promise<string> {
    const vaultPowers = vaults.map((vault, i) => {
      if (typeof vault === "string") {
        vault = new VotingVault(vault, this.context);
      }
      return vault.getVotingPower(this.address, atBlock, extraData?.[i]);
    });
    return sumStrings(await Promise.all(vaultPowers));
  }

  /**
   * Get the casted votes for this Voter in a given Voting Contract
   */
  async getVotes(votingContractAddress: string): Promise<Vote[]> {
    const votingContract = new VotingContract(
      votingContractAddress,
      [],
      this.context,
    );
    return votingContract.getVotes(this.address);
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
