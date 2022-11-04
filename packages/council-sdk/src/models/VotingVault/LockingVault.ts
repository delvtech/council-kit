import { CouncilContext } from "src/context";
import { Token } from "src/models/Token";
import { VotingVault } from "./VotingVault";

export class LockingVault extends VotingVault {
  constructor(
    address: string,
    context: CouncilContext,
    name = "Locking Vault",
  ) {
    super(address, context, name);
  }

  async getToken(): Promise<Token> {
    return new Token(
      "0x2b1a91De5B9C3Ad6439eeAeD0E481F8cf6E22601",
      this.context,
    );
  }

  async getDepositedBalance(address: string): Promise<string> {
    return "10000";
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
