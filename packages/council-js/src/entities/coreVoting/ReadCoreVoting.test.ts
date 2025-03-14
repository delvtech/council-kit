import { createMockDrift, createStubBlock } from "@delvtech/drift/testing";
import { coreVotingAbi } from "src/entities/coreVoting/abi";
import { EXECUTED_PROPOSAL_HASH } from "src/entities/coreVoting/constants";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { ExecutedProposal, VoteResults } from "src/entities/coreVoting/types";
import { beforeEach, describe, expect, it } from "vitest";

describe("ReadCoreVoting", () => {
  const chainId = 0;
  const address = "0x123";
  const drift = createMockDrift({ chainId });
  const contract = drift.contract({ abi: coreVotingAbi, address });
  const coreVoting = new ReadCoreVoting({ address, drift });

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
      chainId,
      coreVotingAddress: address,
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

  describe("getProposalStatus", () => {
    it('Returns "active" for locked proposals', async () => {
      contract.onRead("proposals").resolves({
        proposalHash: "0x",
        created: 0n,
        unlock: 10n,
        expiration: 20n,
        lastCall: 30n,
        quorum: 1n,
      });
      drift.onGetBlock().resolves(createStubBlock({ number: 5n }));
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("active");
    });

    it('Returns "unlocked" for unlocked proposals', async () => {
      contract.onRead("proposals").resolves({
        proposalHash: "0x",
        created: 0n,
        unlock: 10n,
        expiration: 20n,
        lastCall: 30n,
        quorum: 1n,
      });
      drift.onGetBlock().resolves(createStubBlock({ number: 15n }));
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("unlocked");
    });

    it("Returns 'closed' for un-executed proposals with enough yes votes", async () => {
      contract.onRead("proposals").resolves({
        proposalHash: "0x",
        created: 0n,
        unlock: 10n,
        expiration: 20n,
        lastCall: 30n,
        quorum: 1n,
      });
      drift.onGetBlock().resolves(createStubBlock({ number: 25n }));
      contract.onRead("getProposalVotingPower").resolves([100n, 0n, 0n]);
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("closed");
    });

    it("Returns 'failed' for proposals without enough yes votes", async () => {
      contract.onRead("proposals").resolves({
        proposalHash: "0x",
        created: 0n,
        unlock: 10n,
        expiration: 20n,
        lastCall: 30n,
        quorum: 1n,
      });
      drift.onGetBlock().resolves(createStubBlock({ number: 25n }));
      contract.onRead("getProposalVotingPower").resolves([0n, 0n, 0n]);
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("failed");
    });

    it("Returns 'executed' for proposals with the executed proposal hash and a ProposalCreated event", async () => {
      contract.onRead("proposals").resolves({
        proposalHash: EXECUTED_PROPOSAL_HASH,
        created: 0n,
        unlock: 0n,
        expiration: 0n,
        lastCall: 0n,
        quorum: 0n,
      });
      contract.onGetEvents("ProposalCreated").resolves([
        {
          eventName: "ProposalCreated",
          args: {
            proposalId: 0n,
            created: 0n,
            expiration: 0n,
            execution: 0n,
          },
        },
      ]);
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("executed");
    });

    it('Returns "expired" for proposals past the last call block', async () => {
      contract.onRead("proposals").resolves({
        proposalHash: "0x",
        created: 0n,
        unlock: 10n,
        expiration: 20n,
        lastCall: 30n,
        quorum: 1n,
      });
      drift.onGetBlock().resolves(createStubBlock({ number: 35n }));
      contract.onRead("getProposalVotingPower").resolves([100n, 0n, 0n]);
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("expired");
    });

    it('Returns "unknown" for proposals without a ProposalCreated event', async () => {
      contract.onRead("proposals").resolves({
        proposalHash: EXECUTED_PROPOSAL_HASH,
        created: 0n,
        unlock: 0n,
        expiration: 0n,
        lastCall: 0n,
        quorum: 0n,
      });
      contract.onGetEvents("ProposalCreated").resolves([]);
      const status = await coreVoting.getProposalStatus(0n);
      expect(status).toBe("unknown");
    });
  });
});
