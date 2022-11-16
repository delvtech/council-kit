import { VestingVault, VestingVault__factory } from "@council/typechain";
import { VoteChangeEvent } from "@council/typechain/dist/contracts/vaults/VestingVault.sol/VestingVault";
import { BigNumber, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

export interface Grant {
  allocation: string;
  withdrawn: string;
  createdTimestamp: number;
  expirationTimestamp: number;
  unlockTimestamp: number;
  votingPower: string;
  delegate: string;
  range: [string, string];
}

export interface VoterWithPower {
  address: string;
  power: string;
}

export class VestingVaultContractDataSource
  extends VotingVaultContractDataSource
  implements VotingVaultDataSource
{
  contract: VestingVault;

  constructor(address: string, provider: providers.Provider) {
    super(address, provider);
    this.contract = VestingVault__factory.connect(address, provider);
  }

  getToken(this: ContractDataSource<VestingVault>): Promise<string> {
    return this.call("token", []);
  }

  async getGrant(
    this: ContractDataSource<VestingVault>,
    address: string,
  ): Promise<Grant> {
    const {
      allocation,
      withdrawn,
      created,
      expiration,
      cliff,
      latestVotingPower,
      delegatee,
      range,
    } = await this.call("getGrant", [address]);
    return {
      allocation: formatEther(allocation),
      withdrawn: formatEther(withdrawn),
      createdTimestamp: created.toNumber() * 1000,
      expirationTimestamp: expiration.toNumber() * 1000,
      unlockTimestamp: cliff.toNumber() * 1000,
      votingPower: formatEther(latestVotingPower),
      delegate: delegatee.toString(),
      range: [formatEther(range[0]), formatEther(range[1])],
    };
  }

  async getDelegate(address: string): Promise<string> {
    const grant = await this.getGrant(address);
    return grant.delegate;
  }

  getDelegatorsTo(
    address: string,
    atBlock?: number,
  ): Promise<VoterWithPower[]> {
    return this.cached(["getDelegatorsTo", address, atBlock], async () => {
      const voteChangeEvents = await this.getVoteChangeEvents(
        address,
        undefined,
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

  async getStaleBlockLag(
    this: ContractDataSource<VestingVault>,
  ): Promise<number> {
    const staleBlockLagBigNumber = await this.call("staleBlockLag", []);
    return staleBlockLagBigNumber.toNumber();
  }

  async getHistoricalVotingPower(
    this: ContractDataSource<VestingVault>,
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
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterWithPower[]> {
    return this.cached(
      ["getAllVotersWithPower", fromBlock, toBlock],
      async () => {
        const voteChangeEvents = await this.getVoteChangeEvents(
          undefined,
          undefined,
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

  getVoteChangeEvents(
    to?: string,
    from?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoteChangeEvent[]> {
    return this.cached(["VoteChange", to, from, fromBlock, toBlock], () => {
      const filter = this.contract.filters.VoteChange(to, from);
      return this.contract.queryFilter(filter, fromBlock, toBlock);
    });
  }
}
