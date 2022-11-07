import { CouncilContext } from "src/context";
import { GSCVault } from "src/models/VotingVault/GSCVault";
import { VotingContract } from "./VotingContract";

export class GSCVotingContract extends VotingContract {
  vaults: [GSCVault];

  constructor(
    address: string,
    gscVault: GSCVault | string,
    context: CouncilContext,
    name = "GSC Voting",
  ) {
    super(address, [], context, name);
    const vault =
      gscVault instanceof GSCVault
        ? gscVault
        : new GSCVault(gscVault, this.context);
    this.vaults = [vault];
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
}
