import { FixedNumber, Signer } from "ethers";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import {
  GrantData,
  VestingVaultContractDataSource,
} from "src/datasources/votingVault/VestingVaultContractDataSource";
import { Token } from "src/models/token/Token";
import { Voter } from "src/models/Voter";
import { VoterPowerBreakdown } from "src/models/votingVault/types";
import { sumStrings } from "src/utils/sumStrings";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

export interface VestingVaultOptions extends VotingVaultOptions {
  dataSource?: VestingVaultContractDataSource;
}

/**
 * A VotingVault that gives voting power for receiving grants and applies a
 * multiplier on unvested tokens to reduce their voting power.
 * @category Models
 */
export class VestingVault extends VotingVault<VestingVaultContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: VestingVaultOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "Vesting Vault",
      dataSource:
        options?.dataSource ??
        context.registerDataSource(
          { address, type: VestingVaultContractDataSource.type },
          new VestingVaultContractDataSource(address, context),
        ),
    });
  }

  /**
   * Get this vault's token.
   */
  async getToken(): Promise<Token> {
    const address = await this.dataSource.getToken();
    return new Token(address, this.context);
  }

  /**
   * Get this vault's unvested multiplier, a number that represents the voting
   * power of each unvested token as a percentage of a vested token. For example
   * if unvested tokens have 50% voting power compared to vested ones, this
   * value would be 50.
   */
  getUnvestedMultiplier(): Promise<number> {
    return this.dataSource.getUnvestedMultiplier();
  }

  /**
   * Get the grant data for a given address.
   */
  getGrant(address: string): Promise<GrantData> {
    return this.dataSource.getGrant(address);
  }

  /**
   * Gets the amount of tokens currently claimable from the grant.
   * Mimics internal function https://github.com/delvtech/council/blob/main/contracts/vaults/VestingVault.sol#L434
   * @param address - The grantee address.
   * @returns The amount of claimable tokens.
   */
  async getGrantWithdrawableAmount(address: string): Promise<string> {
    const currentBlock = await this.context.provider.getBlockNumber();
    const grant = await this.getGrant(address);
    const unlock = grant.unlockBlock;
    const end = grant.expirationBlock;

    // funds are not unlocked
    if (currentBlock < unlock) {
      return "0";
    }

    // all funds are claimable
    if (currentBlock >= end) {
      const amount = FixedNumber.from(grant.allocation).subUnsafe(
        FixedNumber.from(grant.withdrawn),
      );
      return amount.toString();
    }

    const grantDuration = FixedNumber.from(end - unlock);
    const blockDelta = FixedNumber.from(currentBlock - unlock);
    const amount = FixedNumber.from(grant.allocation)
      .mulUnsafe(blockDelta)
      .divUnsafe(grantDuration);

    return amount.subUnsafe(FixedNumber.from(grant.withdrawn)).toString();
  }

  /**
   * Get all participants that have voting power in this vault.
   * @param fromBlock - Include all voters that had power on or after this block number.
   * @param toBlock - Include all voters that had power on or before this block number.
   */
  async getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const votersWithPower = await this.dataSource.getVotingPowerBreakdown(
      undefined,
      fromBlock,
      toBlock,
    );
    return votersWithPower.map(
      ({ address }) => new Voter(address, this.context),
    );
  }

  /**
   * Get all participants that have voting power in this vault along with their
   * voting power, the amount of voting power being delegated to them, and the
   * amount of power delegated to them by each delegator. This is a convenience
   * method to fetch voting power and delegation data for a large number of
   * voters in a single call.
   * @param address - Get a breakdown for a specific address.
   * @param fromBlock - Include all voters that had power on or after this block
   * number.
   * @param toBlock - Include all voters that had power on or before this block
   * number.
   */
  async getVotingPowerBreakdown(
    address?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterPowerBreakdown[]> {
    const voterPowerBreakdowns = await this.dataSource.getVotingPowerBreakdown(
      address,
      fromBlock,
      toBlock,
    );
    return voterPowerBreakdowns.map(
      ({ address, votingPower, votingPowerFromDelegators, delegators }) => ({
        voter: new Voter(address, this.context),
        votingPower,
        votingPowerFromDelegators,
        delegators: delegators.map(({ address, votingPower }) => ({
          voter: new Voter(address, this.context),
          votingPower,
        })),
      }),
    );
  }

  /**
   * Get the number of blocks before the delegation history is forgotten. Voting
   * power from this vault can't be used on proposals that are older than the
   * stale block lag.
   */
  getStaleBlockLag(): Promise<number> {
    return this.dataSource.getStaleBlockLag();
  }

  /**
   * Get the voting power for a given address at a given block without
   * accounting for the stale block lag.
   * @param address
   * @param atBlock
   * @returns The historical voting power of the given address.
   */
  async getHistoricalVotingPower(
    address: string,
    atBlock?: number,
  ): Promise<string> {
    return this.dataSource.getHistoricalVotingPower(address, atBlock);
  }

  /**
   * Get the sum of voting power held by all voters in this vault.
   * @param atBlock - Get the total held at this block number.
   */
  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const allVotersWithPower = await this.dataSource.getVotingPowerBreakdown(
      undefined,
      undefined,
      atBlock,
    );
    return sumStrings(allVotersWithPower.map(({ votingPower }) => votingPower));
  }

  /**
   * Get the current delegate of a given address.
   */
  async getDelegate(address: string): Promise<Voter> {
    const delegateAddress = await this.dataSource.getDelegate(address);
    return new Voter(delegateAddress, this.context);
  }

  /**
   * Get all voters delegated to a given address in this vault.
   */
  async getDelegatorsTo(address: string, atBlock?: number): Promise<Voter[]> {
    const delegators = await this.dataSource.getDelegatorsTo(address, atBlock);
    return delegators.map(({ address }) => new Voter(address, this.context));
  }

  /**
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.changeDelegate(signer, delegate, options);
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @param signer - The Signer of the wallet with a grant to claim.
   * @returns The transaction hash.
   */
  claim(signer: Signer, options?: TransactionOptions): Promise<string> {
    return this.dataSource.claim(signer, options);
  }
}
