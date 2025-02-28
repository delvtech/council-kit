import {
  Address,
  Bytes,
  ContractWriteOptions,
  Hash,
  OnMinedParam,
  ReadWriteAdapter,
} from "@delvtech/drift";
import { BALLOTS } from "src/entities/coreVoting/constants";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { Ballot } from "src/entities/coreVoting/types";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";

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

  /**
   * Execute a proposal.
   */
  async executeProposal({
    args: { proposalId, targets, calldatas },
    options,
  }: EntityWriteParams<{
    proposalId: bigint;
    targets: Address[];
    calldatas: Bytes[];
  }>): Promise<Hash> {
    return this.contract.write(
      "execute",
      {
        proposalId,
        targets,
        calldatas,
      },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            await this.contract.invalidateRead("proposals", [proposalId]);
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Vote on this a proposal.
   */
  async vote({
    proposalId,
    ballot,
    vaults,
    extraVaultData,
    options,
  }: {
    proposalId: bigint;
    ballot: Ballot;
    /**
     * The vaults to draw voting power from. Defaults to the `CoreVoting`'s
     * configured vaults.
     */
    vaults: Address[];
    /**
     * Extra data given to the vaults to help calculation.
     */
    extraVaultData?: Bytes[];
    options?: ContractWriteOptions & OnMinedParam;
  }): Promise<Hash> {
    const voter = await this.contract.getSignerAddress();

    // Filter out vaults with no voting power which would cause a revert.
    const vaultsWithPower: Address[] = [];
    const extraDataForVaultsWithPower: Bytes[] = [];
    await Promise.all(
      vaults.map(async (address, i) => {
        const extraData = extraVaultData?.[i] || "0x";
        const readVault = new ReadVotingVault({
          address,
          drift: this.drift,
        });
        const power = await readVault.getVotingPower({
          voter,
          extraData,
        });

        if (power > 0n) {
          vaultsWithPower.push(address);
          extraDataForVaultsWithPower.push(extraData);
        }
      }),
    );

    return this.contract.write(
      "vote",
      {
        proposalId,
        ballot: BALLOTS.indexOf(ballot),
        extraVaultData: extraDataForVaultsWithPower,
        votingVaults: vaultsWithPower,
      },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            await Promise.all([
              this.contract.invalidateReadsMatching("quorums"),
              this.contract.invalidateRead("votes", [voter, proposalId]),
              this.contract.invalidateRead("getProposalVotingPower", {
                proposalId,
              }),
            ]);
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }
}
