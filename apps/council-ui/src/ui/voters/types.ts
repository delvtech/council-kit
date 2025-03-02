import { Address } from "@delvtech/drift";

export interface VoterRowData {
  address: Address;
  ensName: string | null;
  votingPower: bigint;
  numberOfDelegators: number;
  isGSCMember: boolean;
}
