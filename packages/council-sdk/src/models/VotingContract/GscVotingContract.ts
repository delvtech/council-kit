import { CouncilContext } from "src/context";
import { GscVault } from "src/models/VotingVault/GscVault";
import { VotingContract } from "./VotingContract";

export class GscVotingContract extends VotingContract {
  vaults: [GscVault];

  constructor(
    address: string,
    gscVault: GscVault | string,
    context: CouncilContext,
    name = "GSC Voting",
  ) {
    super(address, [], context, name);
    const vault =
      gscVault instanceof GscVault
        ? gscVault
        : new GscVault(gscVault, this.context);
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
