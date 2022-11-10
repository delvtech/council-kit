export interface VaultDataSource {
  address: string;
  getVotingPower: (address: string, atBlock: number) => Promise<string>;
}
