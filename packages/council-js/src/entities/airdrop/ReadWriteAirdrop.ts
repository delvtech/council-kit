import { Address, Hash, ReadWriteAdapter } from "@delvtech/drift";
import { ReadAirdrop } from "src/entities/airdrop/ReadAirdrop";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadWriteLockingVault } from "src/entities/votingVault/lockingVault/ReadWriteLockingVault";

export class ReadWriteAirdrop<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadAirdrop<A> {
  async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.contract.read("token"),
      drift: this.drift,
    });
  }

  async getLockingVault(): Promise<ReadWriteLockingVault> {
    return new ReadWriteLockingVault({
      address: await this.contract.read("lockingVault"),
      drift: this.drift,
    });
  }

  /**
   * Claims tokens from the airdrop and sends them to the user.
   * @return - The transaction hash.
   */
  claim({
    args: { amount, totalGrant, merkleProof, recipient: destination },
    options,
  }: EntityWriteParams<{
    /**
     * Amount of tokens to claim.
     */
    amount: bigint;
    /**
     * The total amount of tokens the user was granted.
     */
    totalGrant: bigint;
    /**
     * A set of hashes that can be used to reconstruct the path from a user
     * (leaf) node to the merkle root, verifying that the user is part of the
     * tree.
     */
    merkleProof: Hash[];
    /**
     * The address which will be credited with funds.
     */
    recipient: Address;
  }>): Promise<Hash> {
    return this.contract.write(
      "claim",
      {
        amount,
        destination,
        merkleProof,
        totalGrant,
      },
      {
        ...options,
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            // Invalidate the claimed amount for the recipient
            this.contract.invalidateRead("claimed", [destination]);

            // Invalidate the balance of the recipient. This requires reading
            // the contract, but in most cases, the read will already be cached.
            const token = await this.getToken();
            token.contract.invalidateRead("balanceOf", {
              account: destination,
            });
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Claims tokens from the airdrop, deposits it into the locking vault, and
   * delegates in a single transaction.
   * @return - The transaction hash.
   */
  claimAndDelegate({
    args: { amount, delegate, totalGrant, merkleProof, destination },
    options,
  }: EntityWriteParams<{
    /**
     * Amount of tokens to claim.
     */
    amount: bigint;
    /**
     * The address the user will delegate to, WARNING - should not be zero.
     */
    delegate: Address;
    /**
     * The total amount of tokens the user was granted.
     */
    totalGrant: bigint;
    /**
     * A set of hashes that can be used to reconstruct the path from a user
     * (leaf) node to the merkle root, verifying that the user is part of the
     * tree.
     */
    merkleProof: Hash[];
    /**
     * The address which will be credited with funds.
     */
    destination: Address;
  }>): Promise<Hash> {
    return this.contract.write(
      "claimAndDelegate",
      {
        amount,
        delegate,
        totalGrant,
        merkleProof,
        destination,
      },
      {
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Remove funds from the airdrop after expiration
   * @return - The transaction hash.
   */
  async reclaim({
    args: { destination },
    options,
  }: EntityWriteParams<{
    /**
     * The address which will be credited with funds.
     */
    destination: Address;
  }>): Promise<Hash> {
    const hash = await this.contract.write(
      "reclaim",
      { destination },
      {
        onMined: async (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
    return hash;
  }
}
