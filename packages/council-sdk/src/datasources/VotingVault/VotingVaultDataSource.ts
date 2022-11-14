export interface VotingVaultDataSource {
  address: string;
  getVotingPower: (address: string, atBlock: number) => Promise<string>;
}
