import { Address, Bytes, Hash, ReadWriteAdapter } from "@delvtech/drift";
import { BALLOTS } from "src/entities/coreVoting/constants";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { Ballot } from "src/entities/coreVoting/types";
import { EntityWriteParams } from "src/entities/Entity";

export class ReadWriteCoreVoting<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadCoreVoting<A> {
  /**
   * Create a new proposal.
   * @returns The transaction hash.
   */
  createProposal({
    args: {
      targets,
      calldatas,
      lastCallBlock,
      ballot,
      votingVaults,
      extraVaultData = [],
    },
    options,
  }: EntityWriteParams<{
    /**
     * The addresses of the approved vaults to draw voting power from.
     */
    votingVaults: Address[];
    /**
     * The targets (contract addresses) to call.
     */
    targets: Address[];
    /**
     * The execution calldata for each target.
     */
    calldatas: Bytes[];
    /**
     * The block number after which the proposal can't be executed.
     */
    lastCallBlock: bigint;
    /**
     * The initial vote from the signer's account.
     */
    ballot: Ballot;
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: Bytes[];
  }>): Promise<Hash> {
    return this.contract.write(
      "proposal",
      {
        ballot: BALLOTS.indexOf(ballot),
        calldatas,
        extraVaultData,
        lastCall: lastCallBlock,
        targets,
        votingVaults: votingVaults,
      },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            await this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Change the number of blocks that must be waited before a proposal can be executed.
   * @returns The transaction hash.
   */
  setLockDuration({
    args: {
      /**
       * The number of blocks that must be waited.
       */
      blocks,
    },
    options,
  }: EntityWriteParams<{
    blocks: bigint;
  }>): Promise<Hash> {
    return this.contract.write(
      "setLockDuration",
      { _lockDuration: blocks },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            await this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Change whether a vault is approved or not.
   * @returns The transaction hash.
   */
  changeVaultStatus({
    args,
    options,
  }: EntityWriteParams<{
    /**
     * The address of the vault.
     */
    vault: Address;
    /**
     * Whether or not the approved.
     */
    isValid: boolean;
  }>): Promise<Hash> {
    return this.contract.write("changeVaultStatus", args, {
      ...options,
      onMined: async (receipt) => {
        if (receipt?.status === "success") {
          await this.contract.invalidateRead("approvedVaults", [args.vault]);
        }
        options?.onMined?.(receipt);
      },
    });
  }

  /**
   * Change the amount of time (in blocks) that a proposal can still be voted on
   * after it's been unlocked.
   * @returns The transaction hash.
   */
  changeExtraVotingTime({
    args: {
      /**
       * The number of blocks after the proposal is unlocked during which voting
       * can continue.
       */
      extraVoteBlocks,
    },
    options,
  }: EntityWriteParams<{
    extraVoteBlocks: bigint;
  }>): Promise<Hash> {
    return this.contract.write(
      "changeExtraVotingTime",
      { _extraVoteTime: extraVoteBlocks },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            await this.contract.invalidateRead("extraVoteTime");
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }
}
