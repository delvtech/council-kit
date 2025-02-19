import {
  Address,
  ContractWriteOptions,
  Hash,
  OnMinedParam,
  ReadWriteAdapter,
} from "@delvtech/drift";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadVestingVault } from "src/entities/votingVault/vestingVault/ReadVestingVault";

export class ReadWriteVestingVault<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadVestingVault<A> {
  async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.vestingVaultContract.read("token"),
      drift: this.drift,
    });
  }

  /**
   * Change current delegate.
   * @returns The transaction hash.
   */
  changeDelegate({
    /**
     * The address to delegate to. Defaults to the signer's
     * address.
     */
    args: { delegate },
    options,
  }: EntityWriteParams<{
    delegate: Address;
  }>): Promise<Hash> {
    return this.vestingVaultContract.write(
      "delegate",
      { _to: delegate },
      {
        ...options,
        onMined: (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @returns The transaction hash.
   */
  claim({
    options,
  }: {
    options?: ContractWriteOptions & OnMinedParam;
  } = {}): Promise<Hash> {
    return this.vestingVaultContract.write(
      "claim",
      {},
      {
        ...options,
        onMined: (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.clear();
          }
          options?.onMined?.(receipt);
        },
      },
    );
  }
}
