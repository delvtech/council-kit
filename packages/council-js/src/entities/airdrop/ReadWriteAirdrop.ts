import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@delvtech/evm-client";
import { ReadWriteContractFactory } from "src/contract/factory";
import { ReadAirdrop } from "src/entities/airdrop/ReadAirdrop";
import { AirdropAbi } from "src/entities/airdrop/types";
import { ReadWriteContractModelOptions } from "src/entities/Model";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadWriteLockingVault } from "src/entities/votingVault/lockingVault/ReadWriteLockingVault";

/**
 * @category Models
 */
interface ReadWriteAirdropOptions extends ReadWriteContractModelOptions {}

/**
 * @category Models
 */
export class ReadWriteAirdrop extends ReadAirdrop {
  declare contract: CachedReadWriteContract<AirdropAbi>;
  declare contractFactory: ReadWriteContractFactory;

  constructor(options: ReadWriteAirdropOptions) {
    super(options);
  }

  override async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.contract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  override async getLockingVault(): Promise<ReadWriteLockingVault> {
    return new ReadWriteLockingVault({
      address: await this.contract.read("lockingVault"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Claims tokens from the airdrop and sends them to the user.
   * @param amount - Amount of tokens to claim.
   * @param totalGrant - The total amount of tokens the user was granted.
   * @param merkleProof - A set of hashes that can be used to reconstruct the
   * path from a user (leaf) node to the merkle root, verifying that the user is
   * part of the tree.
   * @param recipient - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  async claim({
    amount,
    totalGrant,
    merkleProof,
    recipient,
    options,
  }: {
    amount: bigint;
    totalGrant: bigint;
    merkleProof: `0x${string}`[];
    recipient: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.contract.write(
      "claim",
      {
        amount,
        destination: recipient,
        merkleProof,
        totalGrant,
      },
      options,
    );
    const token = await this.getToken();
    token.contract.deleteRead("balanceOf", { 0: recipient });
    this.contract.deleteRead("claimed", { 0: recipient });
    return hash;
  }

  /**
   * Claims tokens from the airdrop, deposits it into the locking vault, and
   * delegates in a single transaction.
   * @param amount - Amount of tokens to claim.
   * @param delegate - The address the user will delegate to, WARNING - should not be zero.
   * @param totalGrant - The total amount of tokens the user was granted.
   * @param merkleProof - A set of hashes that can be used to reconstruct the
   * path from a user (leaf) node to the merkle root, verifying that the user is
   * part of the tree.
   * @param recipient - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  async claimAndDelegate({
    amount,
    delegate,
    totalGrant,
    merkleProof,
    recipient,
    options,
  }: {
    amount: bigint;
    delegate: `0x${string}`;
    totalGrant: bigint;
    merkleProof: `0x${string}`[];
    recipient: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.contract.write(
      "claimAndDelegate",
      {
        amount,
        delegate,
        totalGrant,
        merkleProof,
        destination: recipient,
      },
      options,
    );
    const lockingVault = await this.getLockingVault();
    lockingVault.contract.clearCache();
    this.contract.deleteRead("claimed", { 0: recipient });
    return hash;
  }

  /**
   * Remove funds from the airdrop after expiration
   * @param recipient - The address which will be credited with funds.
   * @return - The transaction hash.
   */
  async reclaim({
    recipient,
    options,
  }: {
    recipient: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.contract.write(
      "reclaim",
      { destination: recipient },
      options,
    );
    const token = await this.getToken();
    token.contract.deleteRead("balanceOf", { 0: recipient });
    this.contract.clearCache();
    return hash;
  }
}
