import { Adapter, Address, Bytes, Contract, RangeBlock } from "@delvtech/drift";
import { ContractEntityConfig, Entity } from "src/entities/Entity";
import { votingVaultAbi, VotingVaultAbi } from "src/entities/votingVault/abi";
import { convertToBlockNumber } from "src/utils/convertToBlockNumber";

/**
 * A vault which stores voting power by address
 */
export class ReadVotingVault<A extends Adapter = Adapter> extends Entity<A> {
  readonly address: Address;
  readonly contract: Contract<VotingVaultAbi, A>;

  constructor({ address, ...config }: ContractEntityConfig<A>) {
    super(config);
    this.address = address;
    this.contract = this.drift.contract({
      abi: votingVaultAbi,
      address,
    });
  }

  /**
   * Get the usable voting power owned by a given address in this vault.
   * @param extraData - ABI encoded optional extra data used by some vaults,
   *   such as merkle proofs.
   */
  async getVotingPower({
    voter,
    /**
     * The block to get voting power at. Usually the creation block of a
     * proposal.
     */
    block,
    // extraData = "0x00",
    extraData = "0x",
  }: {
    voter: Address;
    block?: RangeBlock;
    extraData?: Bytes;
  }): Promise<bigint> {
    const blockNumber = await convertToBlockNumber(block, this.drift);

    if (blockNumber === undefined) {
      return 0n;
    }

    return this.contract
      .simulateWrite("queryVotePower", {
        blockNumber,
        extraData,
        user: voter,
      })
      .catch((error) => {
        // queryVotePower throws an uninitialized an error if the account is not
        // found/hasn't ever had voting power.
        if (error instanceof Error && error.message.includes("uninitialized")) {
          return 0n;
        }

        throw error;
      });
  }
}
