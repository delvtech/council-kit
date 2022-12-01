import { DataSource } from "src/datasources/DataSource";

export interface VotingVaultDataSource extends DataSource {
  address: string;
  getVotingPower: (address: string, atBlock: number) => Promise<string>;
}
