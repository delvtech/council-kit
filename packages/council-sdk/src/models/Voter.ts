import { CouncilContext } from "src/context";
import { sumStrings } from "src/utils/sumStrings";
import { Model } from "./Model";
import { Vote } from "./Vote";
import { VotingContract } from "./VotingContract/VotingContract";
import { VotingVault } from "./VotingVault/VotingVault";

export class Voter extends Model {
  address: string;

  constructor(address: string, context: CouncilContext) {
    super(context);
    this.address = address;
  }

  async getEnsName(): Promise<string> {
    return "vitalik.eth";
  }

  async getVotingPower(vaults: string[], atBlock?: number): Promise<string> {
    const vaultPowers = vaults.map((address) => {
      const vault = new VotingVault(address, this.context);
      return vault.getVotingPower(this.address, atBlock);
    });
    return sumStrings(await Promise.all(vaultPowers));
  }

  async getVotes(votingContractAddress: string): Promise<Vote[]> {
    const votingContract = new VotingContract(
      votingContractAddress,
      [],
      this.context,
    );
    return votingContract.getVotes(this.address);
  }

  async getParticipation(
    votingContractAddress: string,
    votingVaultAddresses: string[],
  ): Promise<[number, number]> {
    const votingContract = new VotingContract(
      votingContractAddress,
      votingVaultAddresses,
      this.context,
    );
    return await votingContract.getParticipation(this.address);
  }
}
