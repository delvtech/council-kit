import { Address } from "@delvtech/drift";
import {
  VoterWithPower,
  VotingPowerBreakdown,
} from "src/entities/votingVault/types";

/**
 * Merge an array of {@linkcode VotingPowerBreakdown} into a single breakdown,
 * aggregating the voting power of voters and their delegators.
 */
export function mergeVotingPowerBreakdowns(
  breakdowns: VotingPowerBreakdown[],
): VotingPowerBreakdown[] {
  // create a temp object to merge unique addresses
  const voterBreakdownMap: Map<
    Address, // voter
    Omit<VotingPowerBreakdown, "delegators"> & {
      delegatorsMap: Map<Address, VoterWithPower>;
    }
  > = new Map();

  for (const {
    delegators,
    voter,
    votingPower,
    votingPowerFromDelegators,
  } of breakdowns) {
    let mergedBreakdown = voterBreakdownMap.get(voter);

    if (!mergedBreakdown) {
      mergedBreakdown = {
        voter,
        votingPower,
        votingPowerFromDelegators,
        delegatorsMap: new Map(
          delegators.map((delegatorWithPower) => [
            delegatorWithPower.voter,
            delegatorWithPower,
          ]),
        ),
      };
      voterBreakdownMap.set(voter, mergedBreakdown);
      continue;
    }

    mergedBreakdown.votingPower += votingPower;
    mergedBreakdown.votingPowerFromDelegators += votingPowerFromDelegators;

    for (const { voter, votingPower } of delegators) {
      let mergedDelegatorWithPower = mergedBreakdown.delegatorsMap.get(voter);

      if (!mergedDelegatorWithPower) {
        mergedBreakdown.delegatorsMap.set(voter, {
          voter,
          votingPower,
        });
        continue;
      }

      mergedDelegatorWithPower.votingPower += votingPower;
    }
  }

  return Array.from(voterBreakdownMap.values()).map(
    ({ delegatorsMap, ...rest }) => {
      return {
        ...rest,
        delegators: Array.from(delegatorsMap.values()),
      };
    },
  );
}
