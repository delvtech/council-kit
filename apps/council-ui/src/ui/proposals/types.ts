import { Ballot } from "@delvtech/council-viem";

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
