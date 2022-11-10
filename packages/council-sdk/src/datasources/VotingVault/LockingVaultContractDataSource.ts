import {
  LockingVault,
  LockingVault__factory,
} from "@elementfi/council-typechain";
import { BigNumber, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VaultDataSource } from "./VotingVaultDataSource";

export interface VoterWithPower {
  address: string;
  power: string;
}

export class LockingVaultDataSource
  extends ContractDataSource<LockingVault>
  implements VaultDataSource
{
  constructor(address: string, provider: providers.Provider) {
    super(LockingVault__factory.connect(address, provider));
  }

  getToken(): Promise<string> {
    return this.call("token", []);
  }

  async getDepositedBalance(address: string): Promise<string> {
    const [, balanceBigNumber] = await this.call("deposits", [address]);
    return formatEther(balanceBigNumber);
  }

  async getDelegate(address: string): Promise<string> {
    const [delegate] = await this.call("deposits", [address]);
    return delegate;
  }

  getDelegatorsTo(
    address: string,
    atBlock?: string,
  ): Promise<VoterWithPower[]> {
    return this.cached(["getDelegatorsTo", address, atBlock], async () => {
      const filter = this.contract.filters.VoteChange(undefined, address);
      const voteChangeEvents = await this.contract.queryFilter(
        filter,
        undefined,
        atBlock,
      );
      const powerByDelegators: Record<string, BigNumber> = {};
      for (const { args } of voteChangeEvents) {
        const { from, amount } = args;
        powerByDelegators[from] = powerByDelegators[from]?.add(amount) || from;
      }
      return Object.entries(powerByDelegators)
        .filter(([, power]) => power.gt(0))
        .map(([address, power]) => ({
          address,
          power: formatEther(power),
        }));
    });
  }

  async getVotingPower(address: string, atBlock: number): Promise<string> {
    const votingPowerBigNumber = await this.callStatic("queryVotePower", [
      address,
      atBlock,
      "0x00",
    ]);
    return formatEther(votingPowerBigNumber);
  }

  async getStaleBlockLag(): Promise<number> {
    const staleBlockLagBigNumber = await this.call("staleBlockLag", []);
    return staleBlockLagBigNumber.toNumber();
  }

  async getHistoricalVotingPower(
    address: string,
    atBlock: number,
  ): Promise<string> {
    const votingPowerBigNumber = await this.call("queryVotePowerView", [
      address,
      atBlock,
    ]);
    return formatEther(votingPowerBigNumber);
  }

  async getAllVotersWithPower(
    fromBlock?: string | number,
    toBlock?: string | number,
  ): Promise<VoterWithPower[]> {
    return this.cached(
      ["getAllVotersWithPower", fromBlock, toBlock],
      async () => {
        const filter = this.contract.filters.VoteChange();
        const voteChangeEvents = await this.contract.queryFilter(
          filter,
          fromBlock,
          toBlock,
        );
        const powersByVoter: Record<string, BigNumber> = {};
        for (const { args } of voteChangeEvents) {
          const { to, amount } = args;
          powersByVoter[to] = powersByVoter[to]?.add(amount) || amount;
        }
        return Object.entries(powersByVoter)
          .filter(([, power]) => power.gt(0))
          .map(([address, power]) => ({
            address,
            power: formatEther(power),
          }));
      },
    );
  }
}
