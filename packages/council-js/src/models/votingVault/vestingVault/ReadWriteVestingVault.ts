import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@delvtech/evm-client";
import { ReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadWriteToken } from "src/models/token/ReadWriteToken";
import { ReadVestingVault } from "src/models/votingVault/vestingVault/ReadVestingVault";
import { VestingVaultAbi } from "src/models/votingVault/vestingVault/types";

interface ReadWriteVestingVaultOptions extends ReadWriteContractModelOptions {}

export class ReadWriteVestingVault extends ReadVestingVault {
  declare vestingVaultContract: CachedReadWriteContract<VestingVaultAbi>;
  declare contractFactory: ReadWriteContractFactory;

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
   * @param delegate - The address to delegate to. Defaults to the signer's
   * address.
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
      {
        _to: delegate,
      },
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Claim a grant and withdraw the tokens.
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
