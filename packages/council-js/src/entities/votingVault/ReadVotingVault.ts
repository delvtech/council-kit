import { IVotingVault } from "@delvtech/council-artifacts/IVotingVault";
import {
  Adapter,
  Address,
  Bytes,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { ContractEntityConfig, Entity } from "src/entities/Entity";
import { VotingVaultAbi } from "src/entities/votingVault/types";
import { getBlockOrThrow } from "src/utils/getBlockOrThrow";
import { Blockish } from "src/utils/types";

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
      abi: IVotingVault.abi,
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
    options,
  }: {
    voter: Address;
    block?: Blockish;
    extraData?: Bytes;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    if (typeof block !== "bigint") {
      const { number } = await getBlockOrThrow(this.drift, options);

      // No block number available for the requested number, hash, or tag.
      if (number === undefined) {
        return 0n;
      }

      block = number;
    }

    return this.contract
      .simulateWrite("queryVotePower", {
        blockNumber: block,
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
