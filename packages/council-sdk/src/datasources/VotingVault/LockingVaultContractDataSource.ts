import { LockingVault, LockingVault__factory } from "@council/typechain";
import { VoteChangeEvent } from "@council/typechain/dist/contracts/vaults/LockingVault.sol/LockingVault";
import { BigNumber, providers, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

export interface VoterWithPower {
  address: string;
  power: string;
}

export class LockingVaultContractDataSource extends VotingVaultContractDataSource<LockingVault> {
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
    atBlock?: number,
  ): Promise<VoterWithPower[]> {
    return this.cached(["getDelegatorsTo", address, atBlock], async () => {
      const voteChangeEvents = await this.getVoteChangeEvents(
        undefined,
        address,
        undefined,
        atBlock,
      );
      const powerByDelegators: Record<string, BigNumber> = {};
      for (const { args } of voteChangeEvents) {
        const { from, amount } = args;
        powerByDelegators[from] =
          powerByDelegators[from]?.add(amount) || amount;
      }
      return Object.entries(powerByDelegators)
        .filter(([, power]) => power.gt(0))
        .map(([address, power]) => ({
          address,
          power: formatEther(power),
        }));
    });
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
    from?: string,
    to?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoteChangeEvent[]> {
    return this.cached(["VoteChange", from, to, fromBlock, toBlock], () => {
      const filter = this.contract.filters.VoteChange(from, to);
      return this.contract.queryFilter(filter, fromBlock, toBlock);
    });
  }

  async changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "changeDelegation",
      [delegate],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  async deposit(
    signer: Signer,
    account: string,
    amount: string,
    firstDelegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "deposit",
      [account, amount, firstDelegate],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  async withdraw(
    signer: Signer,
    amount: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "withdraw",
      [amount],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }
}
