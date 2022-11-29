import { parseEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { GSCVaultContractDataSource } from "src/datasources/VotingVault/GSCVaultContractDataSource";
import { Voter } from "src/models/Voter";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

interface GSCVaultOptions extends VotingVaultOptions {
  dataSource?: GSCVaultContractDataSource;
}

export class GSCVault extends VotingVault<GSCVaultContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: GSCVaultOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "GSC Vault",
      dataSource:
        options?.dataSource ??
        context.registerDataSource(
          { address },
          new GSCVaultContractDataSource(address, context.provider),
        ),
    });
  }

  getRequiredVotingPower(): Promise<string> {
    return this.dataSource.getRequiredVotingPower();
  }

  async getMembers(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const addresses = await this.dataSource.getMembers(fromBlock, toBlock);
    return addresses.map((address) => new Voter(address, this.context));
  }

  async getJoinDate(address: string): Promise<Date | null> {
    const joinTimestamp = await this.dataSource.getJoinTimestamp(address);
    return joinTimestamp ? new Date(joinTimestamp) : null;
  }

  async getIsMember(address: string): Promise<boolean> {
    return !!(await this.getJoinDate(address));
  }

  getIdleDuration(): Promise<number> {
    return this.dataSource.getIdleDuration();
  }

  async getIsIdle(address: string): Promise<boolean> {
    const joinDate = await this.getJoinDate(address);
    const isMember = !!joinDate;
    return (
      isMember &&
      joinDate.getTime() + (await this.getIdleDuration()) > Date.now()
    );
  }

  async getIsEligible(address: string): Promise<boolean> {
    const requiredVotingPower = await this.getRequiredVotingPower();
    const addressVotingPower = await this.getVotingPower(address);
    return parseEther(addressVotingPower).gte(parseEther(requiredVotingPower));
  }
}
