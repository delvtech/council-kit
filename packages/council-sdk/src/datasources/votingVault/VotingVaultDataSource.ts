import { BytesLike } from "ethers";
import { DataSource } from "src/datasources/base/DataSource";

/**
 * An interface for fetching data from any voting vault.
 * @category Data Sources
 */
export interface VotingVaultDataSource extends DataSource {
  address: string;

  /**
   * Get the voting power owned by a given address in this vault.
   * @param extraData - Abi encoded optional extra data used by some vaults,
   *   such as merkle proofs
   */
  getVotingPower: (
    address: string,
    atBlock?: number,
    extraData?: BytesLike,
  ) => Promise<string>;
}
