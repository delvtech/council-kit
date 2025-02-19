import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { createMockDrift, MockContract } from "@delvtech/drift/testing";
import { EXECUTED_PROPOSAL_HASH } from "src/entities/coreVoting/constants";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { VoteResults } from "src/entities/coreVoting/types";
import { beforeEach, describe, expect, it } from "vitest";

describe("ReadCoreVoting", () => {
  const drift = createMockDrift({ chainId: 0 });
  const coreVoting = new ReadCoreVoting({ address: "0x123", drift });
  const contract = coreVoting.contract as MockContract<typeof CoreVoting.abi>;

  beforeEach(async () => {
    drift.reset();
    await drift.cache.clear();
  });

  it("Returns voting power for a deleted/executed proposal", async () => {
    contract.onRead("proposals").resolves({
      proposalHash: EXECUTED_PROPOSAL_HASH,
      created: 0n,
      expiration: 0n,
      lastCall: 0n,
      quorum: 0n,
      unlock: 0n,
    });
    contract.onGetEvents("Voted").resolves([
      // 2 votes for yes w/ 200 voting power
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 0, votingPower: 200n },
          voter: "0x123",
        },
      },
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 0, votingPower: 200n },
          voter: "0x123",
        },
      },

      // 2 votes for no w/ 150 voting power
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 1, votingPower: 150n },
          voter: "0x123",
        },
      },
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 1, votingPower: 150n },
          voter: "0x123",
        },
      },

      // 2 votes for maybe w/ 100 voting power
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 2, votingPower: 100n },
          voter: "0x123",
        },
      },
      {
        eventName: "Voted",
        args: {
          proposalId: 1n,
          vote: { castBallot: 2, votingPower: 100n },
          voter: "0x123",
        },
      },
    ]);

    const results = await coreVoting.getProposalVotingPower(1n);

    expect(results).toEqual({
      yes: 400n,
      no: 300n,
      maybe: 200n,
    } satisfies VoteResults);
  });
});
