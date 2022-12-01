import { GSCVault, GSCVault__factory } from "@council/typechain";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

export class GSCVaultContractDataSource extends VotingVaultContractDataSource<GSCVault> {
  constructor(address: string, context: CouncilContext) {
    super(GSCVault__factory.connect(address, context.provider), context);
  }

  async getRequiredVotingPower(): Promise<string> {
    const reqVotingPowerBigNumber = await this.call("votingPowerBound", []);
    return formatEther(reqVotingPowerBigNumber);
  }

  async getIdleDuration(): Promise<number> {
    const idleDurationBigNumber = await this.call("idleDuration", []);
    return idleDurationBigNumber.toNumber() * 1000;
  }

  async getMembers(
    fromBlock?: string | number,
    toBlock?: string | number,
  ): Promise<string[]> {
    return this.cached(["getMembers", fromBlock, toBlock], async () => {
      const latestJoinTimestampByMember: Record<string, BigNumber> = {};
      const joinEvents = await this.contract.queryFilter(
        this.contract.filters.MembershipProved(),
        fromBlock,
        toBlock,
      );
      for (const { args } of joinEvents) {
        const { who, when } = args;
        if (
          !latestJoinTimestampByMember[who] ||
          when.gt(latestJoinTimestampByMember[who])
        ) {
          latestJoinTimestampByMember[who] = when;
        }
      }
      const kickEvents = await this.contract.queryFilter(
        this.contract.filters.Kicked(),
        fromBlock,
        toBlock,
      );
      for (const { args } of kickEvents) {
        const { who, when } = args;
        if (
          latestJoinTimestampByMember[who] &&
          when.gt(latestJoinTimestampByMember[who])
        ) {
          // if they were kicked after their latest join timestamp, remove them
          // from the record.
          delete latestJoinTimestampByMember[who];
        }
      }
      return Object.keys(latestJoinTimestampByMember).map((voter) => voter);
    });
  }

  async getJoinTimestamp(address: string): Promise<number | null> {
    const joinDateBigNumber = await this.call("members", [address]);
    const joinDate = joinDateBigNumber.toNumber() * 1000;
    return joinDate > 0 ? joinDate : null;
  }
}
