import { CouncilContext } from "src/context";
import { VotingVault } from "./VotingVault";

export class GscVault extends VotingVault {
  constructor(address: string, context: CouncilContext, name = "GSC Vault") {
    super(address, context, name);
  }

  async getRequiredVotingPower(): Promise<string> {
    return "110000";
  }

  async getJoinDate(address: string): Promise<Date | null> {
    return new Date();
  }

  async getIsMember(address: string): Promise<boolean> {
    return !!(await this.getJoinDate(address));
  }

  async getIdleDuration(): Promise<number> {
    // 4 days in ms
    return 345600000;
  }

  async getIsIdle(address: string): Promise<boolean> {
    const joinDate = await this.getJoinDate(address);
    const isMember = !!joinDate;
    return (
      isMember &&
      joinDate.getTime() + (await this.getIdleDuration()) > Date.now()
    );
  }
}
