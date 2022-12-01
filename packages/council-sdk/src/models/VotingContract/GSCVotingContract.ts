import { CouncilContext } from "src/context";
import { Voter } from "src/models/Voter";
import { GSCVault } from "src/models/VotingVault/GSCVault";
import { VotingContract, VotingContractOptions } from "./VotingContract";

export class GSCVotingContract extends VotingContract<[GSCVault]> {
  constructor(
    address: string,
    gscVault: GSCVault | string,
    context: CouncilContext,
    options?: VotingContractOptions,
  ) {
    super(
      address,
      [
        gscVault instanceof GSCVault
          ? gscVault
          : new GSCVault(gscVault, context),
      ],
      context,
      {
        ...options,
        name: options?.name ?? "GSC Voting",
      },
    );
  }

  getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    return this.vaults[0].getVoters(fromBlock, toBlock);
  }

  getRequiredVotingPower(): Promise<string> {
    return this.vaults[0].getRequiredVotingPower();
  }

  getJoinDate(address: string): Promise<Date | null> {
    return this.vaults[0].getJoinDate(address);
  }

  getIsMember(address: string): Promise<boolean> {
    return this.vaults[0].getIsMember(address);
  }

  getIdleDuration(): Promise<number> {
    return this.vaults[0].getIdleDuration();
  }

  getIsIdle(address: string): Promise<boolean> {
    return this.vaults[0].getIsIdle(address);
  }

  getIsEligible(address: string): Promise<boolean> {
    return this.vaults[0].getIsEligible(address);
  }
}
