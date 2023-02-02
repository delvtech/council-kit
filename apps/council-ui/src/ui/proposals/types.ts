import { Ballot } from "@council/sdk";

export interface ProposalRowData {
  votingContractName: string;
  votingContractAddress: string;
  id: number;
  created: Date | null;
  votingEnds: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
  ballot: Ballot | null;
}

export type ProposalStatus =
  | "UNKNOWN"
  | "IN PROGRESS"
  | "EXPIRED"
  | "FAILED"
  | "EXECUTED";
