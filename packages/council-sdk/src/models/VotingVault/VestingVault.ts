import { CouncilContext } from "src/context";
import { Token } from "src/models/Token";
import { VotingVault } from "./VotingVault";

export class VestingVault extends VotingVault {
  constructor(
    address: string,
    context: CouncilContext,
    name = "Vesting Vault",
  ) {
    super(address, context, name);
  }

  async getToken(): Promise<Token> {
    return new Token(
      "0x2b1a91De5B9C3Ad6439eeAeD0E481F8cf6E22601",
      this.context,
    );
  }

  async getGrant(address: string): Promise<string> {
    return "25000";
  }

  async getStaleBlockLag(): Promise<number> {
    return 200000;
  }

  // will use queryVotePowerView
  async getHistoricalVotingPower(
    address: string,
    atBlock?: number,
  ): Promise<string> {
    return "100000";
  }
}
