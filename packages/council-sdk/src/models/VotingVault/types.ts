import { Voter } from "src/models/Voter";

export interface VoterWithPower {
  voter: Voter;
  votingPower: string;
}
