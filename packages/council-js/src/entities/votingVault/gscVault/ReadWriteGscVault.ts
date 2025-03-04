import { Address, Bytes, Hash, ReadWriteAdapter } from "@delvtech/drift";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadGscVault } from "src/entities/votingVault/gscVault/ReadGscVault";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";

export class ReadWriteGscVault<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadGscVault<A> {
  /**
   * Set the idle duration for a member in this GSC vault. The idle duration is
   * the amount of time a member must be a member before they can vote.
   */
  setIdleDuration({
    args: { duration },
    options,
  }: EntityWriteParams<{
    /**
     * The new idle duration in seconds.
     */
    duration: bigint;
  }>): Promise<Hash> {
    return this.gscVaultContract.write(
      "setIdleDuration",
      { _idleDuration: duration },
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
   * Become a member of this GSC vault.
   * @returns The transaction hash.
   */
  async join({
    args: { vaults, extraVaultData = [] },
    options,
  }: EntityWriteParams<{
    /**
     * The addresses of the approved vaults the joining member has voting power
     * in. This is used to prove the joining member meets the minimum voting
     * power requirement. If voting power is moved to a different vault, the
     * member will become ineligible until they join again with the new vault or
     * risk being kicked.
     */
    vaults: Address[];
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: (Bytes | undefined)[];
  }>): Promise<Hash> {
    // Filter out vaults with no voting power which would cause a revert.
    const voter = await this.contract.getSignerAddress();
    const vaultsWithPower: Address[] = [];
    const extraDataForVaultsWithPower: Bytes[] = [];
    await Promise.all(
      vaults.map(async (address, i) => {
        const extraData = extraVaultData?.[i] || "0x";
        const readVault = new ReadVotingVault({
          address,
          drift: this.drift,
        });
        const power = await readVault.getVotingPower({
          voter,
          extraData,
        });

        if (power > 0n) {
          vaultsWithPower.push(address);
          extraDataForVaultsWithPower.push(extraData);
        }
      }),
    );

    const extraData = vaults.map((_, i) => extraVaultData[i] || "0x");
    return this.gscVaultContract.write(
      "proveMembership",
      { votingVaults: vaults, extraData },
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
   * Remove a member that's become ineligible from this GSC vault. A member
   * becomes ineligible when the voting power in the vaults they joined with
   * drops below the required minimum.
   * @param account -
   * @returns The transaction hash.
   */
  async kick({
    args: { member, extraVaultData = [] },
    options,
  }: EntityWriteParams<{
    /**
     * The address of the ineligible member to kick.
     */
    member: Address;
    /**
     * The extra data the vaults need to load the member's voting power
     */
    extraVaultData?: (Bytes | undefined)[];
  }>): Promise<`0x${string}`> {
    let extraData: Bytes[];
    if (!extraVaultData) {
      // Get the member vaults to create the right amount of default extra data.
      const memberVaults = await this.getMemberVaults(member);
      extraData = memberVaults.map(() => "0x");
    } else {
      extraData = extraVaultData.map((_, i) => extraVaultData[i] || "0x");
    }

    return this.gscVaultContract.write(
      "kick",
      { extraData, who: member },
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
