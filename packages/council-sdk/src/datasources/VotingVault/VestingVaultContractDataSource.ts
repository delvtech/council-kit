import { VestingVault, VestingVault__factory } from "@council/typechain";
import { VoteChangeEvent } from "@council/typechain/dist/contracts/vaults/VestingVault.sol/VestingVault";
import { BigNumber, Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

/**
 * A DataSource with methods for making cached calls to a `VestingVault`
 * contract from the Council protocol.
 * @category Data Sources
 */

export class VestingVaultContractDataSource
  extends VotingVaultContractDataSource<VestingVault>
  implements VotingVaultDataSource
{
  constructor(address: string, context: CouncilContext) {
    super(VestingVault__factory.connect(address, context.provider), context);
  }

  /**
   * Get the address of the associated token for this vault.
   */
  getToken(): Promise<string> {
    return this.call("token", []);
  }

  /**
   * Get the grant data for a given address.
   */
  async getGrant(address: string): Promise<GrantData> {
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
      startBlock: created.toNumber(),
      expirationBlock: expiration.toNumber(),
      unlockBlock: cliff.toNumber(),
      votingPower: formatEther(latestVotingPower),
      delegate: delegatee.toString(),
      range: [formatEther(range[0]), formatEther(range[1])],
    };
  }

  /**
   * Get the address of the current delegate of a given address.
   */
  async getDelegate(address: string): Promise<string> {
    const grant = await this.getGrant(address);
    return grant.delegate;
  }

  /**
   * Get the addresses of all voters delegated to a given address in this vault.
   */
  getDelegatorsTo(
    address: string,
    atBlock?: number,
  ): Promise<VoterAddressWithPower[]> {
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

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  async getStaleBlockLag(): Promise<number> {
    const staleBlockLagBigNumber = await this.call("staleBlockLag", []);
    return staleBlockLagBigNumber.toNumber();
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   */
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

  /**
   * Get the address and voting power of all participants that have voting power
   * in this vault.
   * @param fromBlock - The block number to start searching for voters from.
   * @param toBlock - The block number to stop searching for voters at.
   */
  async getAllVotersWithPower(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterAddressWithPower[]> {
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

  /**
   * Get all emitted `VoteChange` events.
   * @param from - The address that the voting power is coming from.
   * @param to - The address that the voting power is going to.
   * @param fromBlock - The block to start searching for events from.
   * @param toBlock - The block to stop searching for events at.
   */
  getVoteChangeEvents(
    from?: string,
    to?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoteChangeEvent[]> {
    return this.cached(["VoteChange", to, from, fromBlock, toBlock], () => {
      const filter = this.contract.filters.VoteChange(to, from);
      return this.contract.queryFilter(filter, fromBlock, toBlock);
    });
  }

  /**
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  async changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "delegate",
      [delegate],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @param signer - The Signer of the wallet with a grant to claim.
   * @returns The transaction hash.
   */
  async claim(signer: Signer, options?: TransactionOptions): Promise<string> {
    const transaction = await this.callWithSigner("claim", [], signer, options);
    this.clearCached();
    return transaction.hash;
  }
}

/**
 * A grant as it's stored in the contract.
 * @category Data Sources
 */
export interface GrantData {
  /**
   * The total amount of tokens granted.
   */
  allocation: string;

  /**
   * The amount of tokens that have been withdrawn.
   */
  withdrawn: string;

  /**
   * The block number of when the grant starts.
   */
  startBlock: number;

  /**
   * The block number of when the full allocation is vested and any
   * remaining balance can be withdrawn.
   */
  expirationBlock: number;

  /**
   * The block number after which any withdrawable tokens can be withdrawn.
   */
  unlockBlock: number;

  /**
   * The voting power provided by the grant.
   */
  votingPower: string;

  /**
   * The address that can vote with this grant's voting power.
   */
  delegate: string;

  /**
   * The specific range of enumerated tokens in the vault that belong to this
   * grant. This is set when a grant is accepted with the `acceptGrant` method.
   */
  range: [string, string];
}

/**
 * @category Data Sources
 */
export interface VoterAddressWithPower {
  address: string;
  power: string;
}
