import {
  Adapter,
  Address,
  Contract,
  ContractReadOptions,
} from "@delvtech/drift";
import { airdropAbi, AirdropAbi } from "src/entities/airdrop/abi";
import { ContractEntityConfig, Entity } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";

export class ReadAirdrop<A extends Adapter = Adapter> extends Entity<A> {
  contract: Contract<AirdropAbi, A>;

  constructor({ address, ...config }: ContractEntityConfig<A>) {
    super(config);
    this.contract = this.drift.contract({
      abi: airdropAbi,
      address,
    });
  }

  get address(): Address {
    return this.contract.address;
  }

  /**
   * Get the date of when the tokens can be reclaimed (removed by the owner).
   */
  async getExpiration(): Promise<Date> {
    const secondsTimestamp = await this.contract.read("expiration");
    return new Date(Number(secondsTimestamp * 1000n));
  }

  /**
   * Get The merkle root with deposits encoded into it as hash [address, amount]
   */
  getMerkleRoot(): Promise<Address> {
    return this.contract.read("rewardsRoot");
  }

  /**
   * Get the token that will be paid out.
   */
  async getToken(): Promise<ReadToken<A>> {
    return new ReadToken({
      address: await this.contract.read("token"),
      drift: this.drift,
    });
  }

  /**
   * Get the amount that an address has already claimed.
   */
  async getClaimedAmount(
    account: Address,
    options?: ContractReadOptions,
  ): Promise<bigint> {
    return await this.contract.read("claimed", [account], options);
  }

  /**
   * Get the address of the locking vault into which tokens will be deposited
   * when someone claims and delegates in a single tx.
   */
  async getLockingVault(): Promise<ReadLockingVault<A>> {
    const address = await this.contract.read("lockingVault");
    return new ReadLockingVault({
      address,
      drift: this.drift,
    });
  }
}
