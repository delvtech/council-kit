import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
import { createMockDrift } from "@delvtech/drift/testing";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";
import { VoterPowerBreakdown } from "src/entities/votingVault/types";
import { describe, expect, it } from "vitest";

const ALICE = "0x123";
const BOB = "0x456";
const CHARLIE = "0x789";
const DAVE = "0xabc";
const EVE = "0xdef";

describe("ReadLockingVault", () => {
  const drift = createMockDrift();
  function setupVault() {
    const lockingVault = new ReadLockingVault({
      address: "0x",
      drift,
    });
    const contract = drift.contract({
      address: lockingVault.address,
      abi: LockingVault.abi,
    });

    return { lockingVault, contract };
  }

  it("Accurately breaks down voting power", async () => {
    const { contract, lockingVault } = setupVault();

    const foo = contract.onGetEvents("VoteChange").resolves([
      // Alice receives 100
      {
        args: {
          amount: 100n,
          from: ALICE,
          to: ALICE,
        },
        eventName: "VoteChange",
      },
      // Bob delegates 100 to Alice
      {
        args: {
          amount: 100n,
          from: BOB,
          to: ALICE,
        },
        eventName: "VoteChange",
      },
      // Charlie delegates 100 to Alice
      {
        args: {
          amount: 100n,
          from: CHARLIE,
          to: ALICE,
        },
        eventName: "VoteChange",
      },
      // Dave delegates 100 to Alice
      {
        args: {
          amount: 100n,
          from: DAVE,
          to: ALICE,
        },
        eventName: "VoteChange",
      },
      // Eve receives 100
      {
        args: {
          amount: 100n,
          from: EVE,
          to: EVE,
        },
        eventName: "VoteChange",
      },
      // Bob changes his delegation of 100 from Alice to Eve
      {
        args: {
          amount: -100n,
          from: BOB,
          to: ALICE,
        },
        eventName: "VoteChange",
      },
      {
        args: {
          amount: 100n,
          from: BOB,
          to: EVE,
        },
        eventName: "VoteChange",
      },
    ]);

    const powerBreakdown = await lockingVault.getVotingPowerBreakdown();

    expect(powerBreakdown).toEqual([
      {
        voter: ALICE,
        votingPower: 300n,
        votingPowerFromDelegators: 200n,
        delegators: [
          {
            voter: CHARLIE,
            votingPower: 100n,
          },
          {
            voter: DAVE,
            votingPower: 100n,
          },
        ],
      },
      {
        voter: EVE,
        votingPower: 200n,
        votingPowerFromDelegators: 100n,
        delegators: [
          {
            voter: BOB,
            votingPower: 100n,
          },
        ],
      },
    ] satisfies VoterPowerBreakdown[]);
  });
});
