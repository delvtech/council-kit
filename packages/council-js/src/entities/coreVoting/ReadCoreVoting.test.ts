import { createMockDrift } from "@delvtech/drift/testing";
import { coreVotingAbi } from "src/entities/coreVoting/abi";
import { EXECUTED_PROPOSAL_HASH } from "src/entities/coreVoting/constants";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { ExecutedProposal, VoteResults } from "src/entities/coreVoting/types";
import { beforeEach, describe, expect, it } from "vitest";

describe("ReadCoreVoting", () => {
  const drift = createMockDrift({ chainId: 0 });
  const contract = drift.contract({
    abi: coreVotingAbi,
    address: "0x123",
  });
  const coreVoting = new ReadCoreVoting({ address: "0x123", drift });

  beforeEach(async () => {
    drift.reset();
    await drift.cache.clear();
  });

  it("Returns proposal args for deleted/executed proposals", async () => {
    contract.onRead("proposals").resolves({
      proposalHash: EXECUTED_PROPOSAL_HASH,
      created: 0n,
      expiration: 0n,
      lastCall: 0n,
      quorum: 0n,
      unlock: 0n,
    });
    contract.onGetEvents("ProposalCreated").resolves([
      {
        eventName: "ProposalCreated",
        args: {
          proposalId: 1n,
          created: 123n,
          expiration: 456n,
          execution: 789n,
        },
      },
    ]);
    const proposal = await coreVoting.getProposal(1n);
    expect(proposal).toMatchObject({
      proposalId: 1n,
      proposalHash: EXECUTED_PROPOSAL_HASH,
      status: "executed",
      createdBlock: 123n,
      expirationBlock: 456n,
      unlockBlock: 789n,
    } satisfies ExecutedProposal);
  });

  it("Returns voting power for a deleted/executed proposal", async () => {
    // Proposal creation event
    contract.onGetEvents("ProposalCreated").resolves([
      {
        eventName: "ProposalCreated",
        args: {
          proposalId: 1n,
          created: 123n,
          expiration: 456n,
          execution: 789n,
        },
      },
    ]);
    // Executed proposal response
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
      total: 900n,
    } satisfies VoteResults);
  });
});
