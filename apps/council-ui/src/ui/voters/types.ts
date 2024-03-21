export interface VoterRowData {
  address: `0x${string}`;
  ensName: string | null;
  votingPower: bigint;
  numberOfDelegators: number;
  isGSCMember: boolean;
}
