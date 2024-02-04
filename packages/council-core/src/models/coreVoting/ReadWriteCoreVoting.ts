import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import { BALLOTS } from "src/models/coreVoting/constants";
import { ReadCoreVoting } from "src/models/coreVoting/ReadCoreVoting";
import { Ballot, CoreVotingAbi } from "src/models/coreVoting/types";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadWriteProposal } from "src/models/proposal/ReadWriteProposal";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { BlockLike } from "src/utils/blockToReadOptions";

export interface ReadWriteCoreVotingOptions
  extends ReadWriteContractModelOptions {
  vaults?: (ReadVotingVault | `0x${string}`)[];
}

export class ReadWriteCoreVoting extends ReadCoreVoting {
  declare contract: CachedReadWriteContract<CoreVotingAbi>;
  declare contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteCoreVotingOptions) {
    super(options);
  }

  override async getProposal({
    id,
  }: {
    id: bigint;
  }): Promise<ReadWriteProposal | undefined> {
    const proposalInfo = await this._getProposalInfo({ id });
    if (proposalInfo) {
      return new ReadWriteProposal({
        ...proposalInfo,
        coreVoting: this,
        contractFactory: this.contractFactory,
        network: this.network,
      });
    }
  }

  override async getProposals({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadWriteProposal[]> {
    const createdEvents = await this.contract.getEvents("ProposalCreated", {
      fromBlock,
      toBlock,
    });
    return createdEvents.map(
      ({ args: { proposalId, created, execution, expiration } }) =>
        new ReadWriteProposal({
          contractFactory: this.contractFactory,
          coreVoting: this,
          created,
          expiration,
          id: proposalId,
          unlock: execution,
          network: this.network,
        }),
    );
  }

  /**
   * Create a new proposal.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param targets - The targets (contract addresses) to call.
   * @param calldatas - The execution calldata for each target.
   * @param lastCall - The block number after which the proposal can't be executed.
   * @param ballot: The initial vote from the signer's account.
   * @returns The transaction hash.
   */
  async createProposal({
    ballot,
    calldatas,
    lastCall,
    targets,
    vaults,
    extraVaultData = [],
    options,
  }: {
    vaults: (ReadVotingVault | `0x${string}`)[];
    targets: `0x${string}`[];
    calldatas: `0x${string}`[];
    lastCall: bigint;
    ballot: Ballot;
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const vaultAddresses = vaults.map((vault) =>
      typeof vault === "string" ? vault : vault.address,
    );
    const hash = await this.contract.write(
      "proposal",
      {
        ballot: BALLOTS.indexOf(ballot),
        calldatas,
        extraVaultData,
        lastCall,
        targets,
        votingVaults: vaultAddresses,
      },
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Change the number of blocks that must be waited before a proposal can be executed.
   * @param blocks - The number of blocks that must be waited.
   * @returns The transaction hash.
   */
  async setLockDuration({
    blocks,
    options,
  }: {
    blocks: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.contract.write("setLockDuration", blocks, options);
    this.contract.deleteRead("lockDuration");
    return hash;
  }

  /**
   * Change whether a vault is approved or not.
   * @param address -The address of the vault.
   * @param isValid - Whether or not the approved.
   * @returns The transaction hash.
   */
  async changeVaultStatus({
    vault: _vault,
    isValid,
    options,
  }: {
    vault: ReadVotingVault | `0x${string}`;
    isValid: boolean;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const vault =
      _vault instanceof ReadVotingVault
        ? _vault
        : new ReadVotingVault({
            address: _vault,
            contractFactory: this.contractFactory,
            network: this.network,
          });

    const hash = await this.contract.write(
      "changeVaultStatus",
      {
        isValid,
        vault: vault.address,
      },
      options,
    );

    if (isValid) {
      this.vaults.push(vault);
    } else {
      this.vaults = this.vaults.filter(
        ({ address }) => address !== vault.address,
      );
    }

    this.contract.deleteRead("approvedVaults", vault.address);
    return hash;
  }
}
