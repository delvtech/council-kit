import { Signer } from "ethers";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { DataSource } from "src/datasources/base/DataSource";

/**
 * An interface for fetching data from any token.
 * @category Data Sources
 */
export interface AirdropDataSource extends DataSource {
  address: string;

  /**
   * Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
   * owner).
   */
  getExpiration: () => Promise<number>;

  /**
   * Get The merkle root with deposits encoded into it as hash [address, amount]
   */
  getMerkleRoot: () => Promise<string>;

  /**
   * Get the address of the token that will be paid out.
   */
  getToken(): Promise<string>;

  /**
   * Get the amount that an address has already claimed.
   */
  getClaimedAmount: (address: string) => Promise<string>;

  /**
   * Get the address of the locking vault into which tokens will be deposited
   * when someone claims and delegates in a single tx.
   */
  getLockingVault: () => Promise<string>;

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
  claim: (
    signer: Signer,
    amount: string,
    totalGrant: string,
    merkleProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ) => Promise<string>;

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
  claimAndDelegate: (
    signer: Signer,
    amount: string,
    delegate: string,
    totalGrant: string,
    merkleProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ) => Promise<string>;

  /**
   * Remove funds from the airdrop after expiration
   * @param signer - Signer.
   * @param destination - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  reclaim: (
    signer: Signer,
    destination?: string,
    options?: TransactionOptions,
  ) => Promise<string>;
}
