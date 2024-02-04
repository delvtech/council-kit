import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { CachedReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadWriteToken } from "src/models/token/ReadWriteToken";
import { ReadVestingVault } from "src/models/votingVault/vestingVault/ReadVestingVault";
import { VestingVaultAbi } from "src/models/votingVault/vestingVault/types";

interface ReadWriteVestingVaultOptions extends ReadWriteContractModelOptions {}

export class ReadWriteVestingVault extends ReadVestingVault {
  declare vestingVaultContract: CachedReadWriteContract<VestingVaultAbi>;
  declare contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteVestingVaultOptions) {
    super(options);
  }

  override async getToken(): Promise<ReadWriteToken> {
    return new ReadWriteToken({
      address: await this.vestingVaultContract.read("token"),
      contractFactory: this.contractFactory,
      network: this.network,
    });
  }

  /**
   * Change current delegate.
   * @param signer - The Signer of the address delegating.
   * @param delegate - The address to delegate to.
   * @returns The transaction hash.
   */
  async changeDelegate({
    delegate,
    options,
  }: {
    delegate: `0x${string}`;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.vestingVaultContract.write(
      "delegate",
      delegate,
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Claim a grant and withdraw the tokens.
   * @param signer - The Signer of the wallet with a grant to claim.
   * @returns The transaction hash.
   */
  async claim({
    options,
  }: {
    options?: ContractWriteOptions;
  } = {}): Promise<`0x${string}`> {
    const hash = await this.vestingVaultContract.write(
      "claim",
      undefined,
      options,
    );
    const token = await this.getToken();
    token.contract.clearCache();
    this.contract.clearCache();
    return hash;
  }
}
