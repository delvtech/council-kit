import { Signer } from "ethers";
import { DataSource } from "src/datasources/DataSource";
import { TransactionOptions } from "src/datasources/ContractDataSource";

export interface ProposalDataPreview {
  id: number;
  createdBlock: number;
  unlockBlock: number;
  expirationBlock: number;
}

export interface ProposalData extends ProposalDataPreview {
  hash: string;
  requiredQuorum: string;
  lastCallBlock: number;
}

export type Ballot = "yes" | "no" | "maybe";

export interface VoteData {
  address: string;
  proposalId: number;
  power: string;
  ballot: Ballot;
}

export type VoteResults = Record<Ballot, string>;

export interface VotingContractDataSource extends DataSource {
  address: string;
  getProposalCount: () => Promise<number>;
  getProposal: (id: number) => Promise<ProposalData | null>;
  getProposals: (
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<ProposalDataPreview[]>;
  getExecutedProposalIds: (
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<number[]>;
  getVote: (address: string, proposalId: number) => Promise<VoteData | null>;
  getVotes: (
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<VoteData[]>;
  getResults: (proposalId: number) => Promise<VoteResults>;
  vote: (
    signer: Signer,
    vaults: string[],
    proposalId: number,
    ballot: Ballot,
    options?: TransactionOptions,
  ) => Promise<string>;
}
