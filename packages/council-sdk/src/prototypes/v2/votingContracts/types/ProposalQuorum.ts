import { BigNumber } from "ethers";

export interface ProposalQuorum {
  requiredQuorum: BigNumber;
  currentQuorum: BigNumber;
  votes: Record<"yes" | "no" | "maybe", BigNumber>;
}
