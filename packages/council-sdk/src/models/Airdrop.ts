import { Signer } from "ethers";
import { CouncilContext } from "src/context/context";
import { AirdropContractDataSource } from "src/datasources/airdrop/AirdropContractDataSource";
import { AirdropDataSource } from "src/datasources/airdrop/AirdropDataSource";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { Model, ModelOptions } from "./Model";
import { Token } from "./token/Token";
import { LockingVault } from "./votingVault/LockingVault";

/**
 * @category Models
 */
export interface AirdropOptions extends ModelOptions {
  /**
   * A data source to use instead of registering one with the `context`. If you
   * pass in a data source, you take over the responsibility of registering it
   * with the `context` to make it available to other models and data sources.
   */
  dataSource?: AirdropDataSource;
}

/**
 * @category Models
 */
export class Airdrop extends Model {
  address: string;
  dataSource: AirdropDataSource;

  constructor(
    address: string,
    context: CouncilContext,
    options?: AirdropOptions,
  ) {
    super(context, options);
    this.address = address;
    this.dataSource =
      options?.dataSource ||
      context.registerDataSource(
        { address },
        new AirdropContractDataSource(address, context),
      );
  }

  /**
   * Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
   * owner).
   */
  async getExpiration(): Promise<Date> {
    const timestamp = await this.dataSource.getExpiration();
    return new Date(timestamp * 1000);
  }

  /**
   * Get The merkle root with deposits encoded into it as hash [address, amount]
   */
  getMerkleRoot(): Promise<string> {
    return this.dataSource.getMerkleRoot();
  }

  /**
   * Get the token that will be paid out.
   */
  async getToken(): Promise<Token> {
    const address = await this.dataSource.getToken();
    return new Token(address, this.context);
  }

  /**
   * Get the token balance of a given address
   */
  getClaimedAmount(address: string): Promise<string> {
    return this.dataSource.getClaimedAmount(address);
  }

  /**
   * Get the address of the locking vault into which tokens will be deposited
   * when someone claims and delegates in a single tx.
   */
  async getLockingVault(): Promise<LockingVault> {
    const address = await this.dataSource.getLockingVault();
    return new LockingVault(address, this.context);
  }

  /**
   * Claims tokens from the airdrop and sends them to the user.
   * @param signer - Signer.
   * @param amount - Amount of tokens to claim.
   * @param totalGrant - The total amount of tokens the user was granted.
   * @param merkleProof - A set of hashes that can be used to reconstruct the
   * path from a user (leaf) node to the merkle root, verifying that the user is
   * part of the tree.
   * @param destination - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  async claim(
    signer: Signer,
    amount: string,
    totalGrant: string,
    merkleProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.claim(
      signer,
      amount,
      totalGrant,
      merkleProof,
      destination,
      options,
    );
  }

  /**
   * Claims tokens from the airdrop, deposits it into the locking vault, and
   * delegates in a single transaction.
   * @param signer - Signer.
   * @param amount - Amount of tokens to claim.
   * @param delegate - The address the user will delegate to, WARNING - should not be zero.
   * @param totalGrant - The total amount of tokens the user was granted.
   * @param merkleProof - A set of hashes that can be used to reconstruct the
   * path from a user (leaf) node to the merkle root, verifying that the user is
   * part of the tree.
   * @param destination - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  async claimAndDelegate(
    signer: Signer,
    amount: string,
    delegate: string,
    totalGrant: string,
    merkleProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.claimAndDelegate(
      signer,
      amount,
      delegate,
      totalGrant,
      merkleProof,
      destination,
      options,
    );
  }
}
