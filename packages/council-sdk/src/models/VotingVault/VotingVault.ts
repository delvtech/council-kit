import { CouncilContext } from "src/context";
import { Model } from "src/models/Model";
import { Voter } from "src/models/Voter";

export class VotingVault extends Model {
  address: string;

  constructor(address: string, context: CouncilContext, name = "Voting Vault") {
    super(context, name);
    this.address = address;
  }

  async getTotalVotingPower(atBlock?: number): Promise<string> {
    return "1000000";
  }

  // will use callStatic.queryVotePower to only return actionable voting power.
  async getVotingPower(address: string, atBlock?: number): Promise<string> {
    return "100000";
  }

  async getVoters(): Promise<Voter[]> {
    return [
      new Voter("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", this.context),
      new Voter("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", this.context),
    ];
  }

  async getDelegate(address: string): Promise<Voter> {
    return new Voter(
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      this.context,
    );
  }

  async getDelegatorsTo(address: string, atBlock?: number): Promise<Voter[]> {
    return [
      new Voter("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", this.context),
      new Voter("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", this.context),
    ];
  }
}
