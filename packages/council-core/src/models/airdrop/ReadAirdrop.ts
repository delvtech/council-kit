import { Airdrop as AirdropArtifact } from "@delvtech/council-artifacts/Airdrop";
import { CachedReadContract } from "@delvtech/evm-client";
import { AirdropAbi } from "src/models/airdrop/types";
import { Model, ReadContractModelOptions } from "src/models/Model";
import { ReadToken } from "src/models/token/ReadToken";
import { ReadLockingVault } from "src/models/votingVault/lockingVault/ReadLockingVault";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";

/**
 * @category Models
 */
export interface ReadAirdropOptions extends ReadContractModelOptions {}

/**
 * @category Models
 */
export class ReadAirdrop extends Model {
  contract: CachedReadContract<AirdropAbi>;

  constructor({
    name = "Airdrop",
    address,
    contractFactory,
    network,
    cache,
    namespace,
  }: ReadAirdropOptions) {
    super({ contractFactory, name, network });
    this.contract = contractFactory({
      abi: AirdropArtifact.abi,
      address,
      cache,
      namespace,
    });
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get a timestamp (in MS) of when the tokens can be reclaimed (removed by the
   * owner).
   */
  async getExpiration(): Promise<Date> {
    const secondsTimestamp = await this.contract.read("expiration");
    return new Date(Number(secondsTimestamp * 1000n));
  }

  /**
   * Get The merkle root with deposits encoded into it as hash [address, amount]
   */
  getMerkleRoot(): Promise<`0x${string}`> {
    return this.contract.read("rewardsRoot");
  }

  /**
   * Get the token that will be paid out.
   */
  async getToken(): Promise<ReadToken> {
    return new ReadToken({
      address: await this.contract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Get the amount that an address has already claimed.
   */
  async getClaimedAmount({
    account,
    atBlock,
  }: {
    account: `0x${string}`;
    atBlock?: BlockLike;
  }): Promise<bigint> {
    return await this.contract.read(
      "claimed",
      { 0: account },
      blockToReadOptions(atBlock),
    );
  }

  /**
   * Get the address of the locking vault into which tokens will be deposited
   * when someone claims and delegates in a single tx.
   */
  async getLockingVault(): Promise<ReadLockingVault> {
    const address = await this.contract.read("lockingVault");
    return new ReadLockingVault({
      address,
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }
}
