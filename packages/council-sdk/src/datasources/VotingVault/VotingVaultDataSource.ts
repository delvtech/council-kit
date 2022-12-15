import { DataSource } from "src/datasources/DataSource";

/**
 * An interface for fetching data from any voting vault.
 */
export interface VotingVaultDataSource extends DataSource {
  address: string;

  /**
   * Get the voting power owned by a given address in this vault.
   */
  getVotingPower: (address: string, atBlock: number) => Promise<string>;
}
