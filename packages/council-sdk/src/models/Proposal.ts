import { BigNumber } from "ethers";
import { CouncilContext } from "src/context";
import { getBlockDate } from "src/utils/getBlockDate";
import { Model } from "./Model";
import { Vote, Ballot } from "./Vote";
import { VotingContract } from "./VotingContract/VotingContract";

export class Proposal extends Model {
  id: number;
  votingContract: VotingContract;

  constructor(
    id: number,
    votingContract: VotingContract | string,
    context: CouncilContext,
    name?: string,
  ) {
    super(context, name ?? `Proposal ${id}`);
    this.id = id;
    this.votingContract =
      votingContract instanceof VotingContract
        ? votingContract
        : new VotingContract(votingContract, [], context);
  }

  async getCreatedBlock(): Promise<number> {
    return 6499465;
  }

  async getCreatedDate(): Promise<Date> {
    // safe to cast here since the creation date must be in the past
    return getBlockDate(
      await this.getCreatedBlock(),
      this.context.provider,
    ) as Promise<Date>;
  }

  async getExpirationBlock(): Promise<number> {
    return 6556585;
  }

  async getExpirationDate(): Promise<Date | null> {
    return getBlockDate(await this.getExpirationBlock(), this.context.provider);
  }

  async getUnlockBlock(): Promise<number> {
    return 6520885;
  }

  async getUnlockDate(): Promise<Date | null> {
    return getBlockDate(await this.getUnlockBlock(), this.context.provider);
  }

  async getLastCallBlock(): Promise<number> {
    return 6613705;
  }

  async getLastCallDate(): Promise<Date | null> {
    return getBlockDate(await this.getCreatedBlock(), this.context.provider);
  }

  /**
   * Proposals are active during their voting period, i.e., from creation block
   * up to expiration block or execution. This will be false if the current
   * block is later than the proposal's expiration or the proposal has been
   * executed.
   */
  async getIsActive(): Promise<boolean> {
    return true;
  }

  async getIsExecuted(): Promise<boolean> {
    return false;
  }

  async getVotes(atBlock?: number[]): Promise<Vote[]> {
    const voteEvents: [string, Ballot][] = [
      ["10000", "yes"],
      ["90000", "yes"],
      ["5000", "yes"],
      ["50000", "no"],
    ];

    return voteEvents.map(
      ([power, ballot]) => new Vote(power, ballot, this, this.context),
    );
  }

  async getVote(address: string): Promise<Vote> {
    return new Vote("10000", "yes", this, this.context);
  }

  async getVotingPower(address: string): Promise<string> {
    return this.votingContract.getVotingPower(
      address,
      await this.getCreatedBlock(),
    );
  }

  async getResults(): Promise<{
    yes: string;
    no: string;
    maybe: string;
  }> {
    return {
      yes: "105000",
      no: "50000",
      maybe: "0",
    };
  }

  async getQuorum(): Promise<string> {
    return "1100000";
  }

  async getQuorumRatio(): Promise<number> {
    const results = await this.getResults();

    const totalPowerVoted = BigNumber.from(0);
    for (const power of Object.values(results)) {
      totalPowerVoted.add(BigNumber.from(power));
    }
    return totalPowerVoted
      .div(BigNumber.from(await this.getQuorum()))
      .toNumber();
  }
}
