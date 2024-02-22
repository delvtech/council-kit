import {
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@delvtech/evm-client";
import { ReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteContractModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadGscVault } from "src/models/votingVault/gscVault/ReadGscVault";
import { GscVaultAbi } from "src/models/votingVault/gscVault/types";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";

export interface ReadWriteGscVaultOptions
  extends ReadWriteContractModelOptions {}

export class ReadWriteGscVault extends ReadGscVault {
  declare gscVaultContract: CachedReadWriteContract<GscVaultAbi>;
  declare contractFactory: ReadWriteContractFactory;

  constructor(options: ReadWriteGscVaultOptions) {
    super(options);
  }

  /**
   * Set the idle duration for a member in this GSC vault. The idle duration is
   * the amount of time a member must be a member before they can vote.
   * @param duration - The new idle duration in seconds.
   */
  async setIdleDuration({
    duration,
    options,
  }: {
    duration: bigint;
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.gscVaultContract.write(
      "setIdleDuration",
      { _idleDuration: duration },
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Become a member of this GSC vault.
   * @param vaults - The addresses of the approved vaults the joining member has
   *   voting power in. This is used to prove the joining member meets the
   *   minimum voting power requirement. If voting power is moved to a different
   *   vault, the member will become ineligible until they join again with the
   *   new vault or risk being kicked.
   * @returns The transaction hash.
   */
  async join({
    vaults,
    extraVaultData = [],
    options,
  }: {
    vaults: (ReadVotingVault | `0x${string}`)[];
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const vaultAddresses = vaults.map((vault) =>
      typeof vault === "string" ? vault : vault.address,
    );
    const hash = await this.gscVaultContract.write(
      "proveMembership",
      {
        extraData: extraVaultData,
        votingVaults: vaultAddresses,
      },
      options,
    );
    this.contract.clearCache();
    return hash;
  }

  /**
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param account - The address of the ineligible member to kick.
   * @returns The transaction hash.
   */
  async kick({
    account,
    extraVaultData = [],
    options,
  }: {
    account: ReadVoter | `0x${string}`;
    /**
     * The extra data the vaults need to load the member's voting power
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const hash = await this.gscVaultContract.write(
      "kick",
      {
        extraData: extraVaultData,
        who: typeof account === "string" ? account : account.address,
      },
      options,
    );
    this.contract.clearCache();
    return hash;
  }
}
