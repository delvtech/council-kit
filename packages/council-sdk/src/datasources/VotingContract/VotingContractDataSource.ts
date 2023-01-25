import { BytesLike, Signer } from "ethers";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { DataSource } from "src/datasources/DataSource";

/**
 * An interface for fetching data from any voting contract.
 * @category Data Sources
 */
export interface VotingContractDataSource extends DataSource {
  address: string;

  /**
   * Get the total number of proposals created in this voting contract
   */
  getProposalCount: () => Promise<number>;

  getProposalCreatedBy: (id: number) => Promise<string | null>;
  getProposalCreatedTransactionHash: (id: number) => Promise<string | null>;

  /**
   * Get a proposal's `ProposalData` by `id` if it exists.
   */
  getProposal: (id: number) => Promise<ProposalData | null>;

  /**
   * Create a new proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param targets - The targets (contract addresses) to call.
   * @param calldatas - The calldatas to call each target with.
   * @param lastCall: A block number that limits when the proposal can be executed.
   * @param ballot: The vote for the proposal from the signer's account.
   * @returns The transaction hash.
   */
  createProposal: (
    signer: Signer,
    vaults: string[],
    targets: string[],
    calldatas: BytesLike[],
    lastCall: number,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ) => Promise<string>;

  /**
   * Get the `ProposalDataPreview` of all proposals ever created.
   * @param fromBlock - Include all proposals created on or after this block number.
   * @param toBlock - Include all proposals created on or before this block number.
   */
  getProposals: (
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<ProposalDataPreview[]>;

  /**
   * Get the id of all executed proposals.
   * @param fromBlock - Include all proposals executed on or after this block number.
   * @param toBlock - Include all proposals executed on or before this block number.
   * @returns
   */
  getExecutedProposalIds: (
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<number[]>;

  /**
   * Get a casted vote for a given address on
   * a given proposal id.
   */
  getVote: (address: string, proposalId: number) => Promise<VoteData | null>;

  /**
   * Get all casted votes on this proposal
   * @param fromBlock - Include all votes casted on or after this block number.
   * @param toBlock - Include all votes casted on or before this block number.
   */
  getVotes: (
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<VoteData[]>;

  /**
   * Get the total voting power of all votes on this proposal by their ballot.
   * Not available on executed proposals.
   */
  getResults: (proposalId: number) => Promise<VoteResults>;

  /**
   * Vote on this proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param proposalId - The id of the proposal to vote on.
   * @param ballot - The ballot to cast.
   * @returns The transaction hash.
   */
  vote: (
    signer: Signer,
    vaults: string[],
    proposalId: number,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ) => Promise<string>;
}

/**
 * A preview of `ProposalData`, emitted in logs.
 * @category Data Sources
 */
export interface ProposalDataPreview {
  id: number;
  createdBlock: number;
  unlockBlock: number;
  expirationBlock: number;
}

/**
 * A proposal as it's stored in the contract.
 * @category Data Sources
 */
export interface ProposalData extends ProposalDataPreview {
  hash: string;
  requiredQuorum: string;
  lastCallBlock: number;
}

/**
 * A valid ballot option.
 * @category Data Sources
 */
export type Ballot = "yes" | "no" | "maybe";

/**
 * The vote data emitted in logs.
 * @category Data Sources
 */
export interface VoteData {
  address: string;
  proposalId: number;
  power: string;
  ballot: Ballot;
}

/**
 * The amount of voting power casted by ballot.
 * @category Data Sources
 */
export type VoteResults = Record<Ballot, string>;
