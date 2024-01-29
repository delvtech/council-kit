import { Airdrop as AirdropArtifact } from "@council/artifacts/dist/Airdrop";
import {
  CachedReadContract,
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { BlockLike, blockToReadOptions } from "src/contract/args";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import {
  Model,
  ReadContractModelOptions,
  ReadWriteContractModelOptions,
} from "src/models/Model";
import { ReadToken, ReadWriteToken } from "src/models/token/Token";
import { ReadLockingVault } from "src/models/VotingVault/LockingVault";
import { formatUnits } from "src/utils/formatUnits";

const airdropAbi = AirdropArtifact.abi;
type AirdropAbi = typeof airdropAbi;

/**
 * @category Models
 */
export interface ReadAirdropOptions extends ReadContractModelOptions {}

/**
 * @category Models
 */
export class ReadAirdrop extends Model {
  protected _contract: CachedReadContract<AirdropAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadAirdropOptions) {
    super({ contractFactory, name, network });
    this._contract = contractFactory({
      abi: airdropAbi,
      address,
      cache,
      namespace,
    });
  }

  get address(): `0x${string}` {
    return this._contract.address;
  }
  get namespace(): string {
    return this._contract.namespace;
  }

  /**
   * Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
   * owner).
   */
  async getExpiration(): Promise<Date> {
    const secondsTimestamp = await this._contract.read("expiration", {});
    return new Date(Number(secondsTimestamp * 1000n));
  }

  /**
   * Get The merkle root with deposits encoded into it as hash [address, amount]
   */
  getMerkleRoot(): Promise<string> {
    return this._contract.read("rewardsRoot", {});
  }

  /**
   * Get the token that will be paid out.
   */
  async getToken(): Promise<ReadToken> {
    const address = await this._contract.read("token", {});
    return new ReadToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  /**
   * Get the amount that an address has already claimed.
   */
  async getClaimedAmount({
    address,
    atBlock,
  }: {
    address: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<string> {
    const claimed = await this._contract.read(
      "claimed",
      address,
      blockToReadOptions(atBlock),
    );
    const token = await this.getToken();
    const decimals = await token.getDecimals();
    return formatUnits(claimed, decimals);
  }

  /**
   * Get the address of the locking vault into which tokens will be deposited
   * when someone claims and delegates in a single tx.
   */
  async getLockingVault(): Promise<ReadLockingVault> {
    const address = await this._contract.read("lockingVault", {});
    return new ReadLockingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }
}

/**
 * @category Models
 */
interface ReadWriteAirdropOptions extends ReadWriteContractModelOptions {}

/**
 * @category Models
 */
export class ReadWriteAirdrop extends ReadAirdrop {
  protected declare _contract: CachedReadWriteContract<AirdropAbi>;
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteAirdropOptions) {
    super(options);
  }

  override async getToken(): Promise<ReadWriteToken> {
    const address = await this._contract.read("token", {});
    return new ReadWriteToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
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
  }): Promise<string> {
    const hash = await this._contract.write(
      "claim",
      {
        amount,
        destination: recipient,
        merkleProof,
        totalGrant,
      },
      options,
    );
    this._contract.deleteRead("claimed", recipient);
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
  }): Promise<string> {
    const hash = await this._contract.write(
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
    this._contract.deleteRead("claimed", recipient);
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
    const hash = await this._contract.write("reclaim", recipient, options);
    this._contract.clearCache();
    return hash;
  }
}
