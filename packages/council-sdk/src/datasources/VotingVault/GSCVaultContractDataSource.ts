import { GSCVault, GSCVault__factory } from "@elementfi/council-typechain";
import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

export class GSCVaultContractDataSource extends VotingVaultContractDataSource {
  contract: GSCVault;

  constructor(address: string, provider: providers.Provider) {
    super(address, provider);
    this.contract = GSCVault__factory.connect(address, provider);
  }

  async getRequiredVotingPower(
    this: ContractDataSource<GSCVault>,
  ): Promise<string> {
    const reqVotingPowerBigNumber = await this.call("votingPowerBound", []);
    return formatEther(reqVotingPowerBigNumber);
  }

  async getIdleDuration(this: ContractDataSource<GSCVault>): Promise<number> {
    const idleDurationBigNumber = await this.call("idleDuration", []);
    return idleDurationBigNumber.toNumber() * 1000;
  }

  async getMembers(
    this: ContractDataSource<GSCVault>,
    fromBlock?: string | number,
    toBlock?: string | number,
  ): Promise<string[]> {
    return this.cached(["getMembers", fromBlock, toBlock], async () => {
      const filter = this.contract.filters.MembershipProved();
      const membershipProvedEvents = await this.contract.queryFilter(filter);
      const memberAddresses = membershipProvedEvents.map(
        ({ args }) => args.who,
      );
      return Array.from(new Set(memberAddresses));
    });
  }

  async getJoinTimestamp(
    this: ContractDataSource<GSCVault>,
    address: string,
  ): Promise<number> {
    const joinDateBigNumber = await this.call("members", [address]);
    return joinDateBigNumber.toNumber() * 1000;
  }
}
