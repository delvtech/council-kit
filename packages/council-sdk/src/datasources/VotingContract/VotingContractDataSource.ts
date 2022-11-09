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

export interface VotingContractDataSource {
  address: string;
  getProposalCount: () => Promise<number>;
  getProposal: (id: number) => Promise<ProposalData | null>;
  getProposals: (
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<ProposalDataPreview[]>;
  getVote: (address: string, proposalId: number) => Promise<VoteData>;
  getVotes: (
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ) => Promise<VoteData[]>;
  getResults: (proposalId: number) => Promise<VoteResults>;
}
