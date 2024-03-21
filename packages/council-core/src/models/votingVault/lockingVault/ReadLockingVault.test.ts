import { NetworkStub } from "@delvtech/evm-client/stubs";
import { ReadCouncil } from "src/models/council/ReadCouncil";
import { LockingVaultAbi } from "src/models/votingVault/lockingVault/types";
import {
  CachedReadContractStub,
  stubContractFactory,
} from "src/test/stubContractFactory";
import { describe, expect, it } from "vitest";

const ALICE = "0x123";
const BOB = "0x456";
const CHARLIE = "0x789";
const DAVE = "0xabc";
const EVE = "0xdef";

describe("ReadLockingVault", () => {
  function setupStub() {
    const council = new ReadCouncil({
      contractFactory: stubContractFactory,
      network: new NetworkStub(),
    });

    const lockingVault = council.lockingVault("0x");
    // The model doesn't know that the factory creates stubbed contracts.
    const contractStub =
      lockingVault.lockingVaultContract as CachedReadContractStub<LockingVaultAbi>;

    return { council, lockingVault, contractStub };
  }

  it("Accurately breaks down voting power", async () => {
    const { contractStub, lockingVault } = setupStub();

    contractStub.stubEvents(
      "VoteChange",
      { filter: { to: undefined }, fromBlock: undefined, toBlock: undefined },
      [
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
      ],
    );

    const powerBreakdown = await lockingVault.getVotingPowerBreakdown();

    expect(powerBreakdown).toEqual([
      {
        voter: expect.objectContaining({ address: ALICE }),
        votingPower: 300n,
        votingPowerFromAllDelegators: 200n,
        votingPowerByDelegator: [
          {
            voter: expect.objectContaining({ address: CHARLIE }),
            votingPower: 100n,
          },
          {
            voter: expect.objectContaining({ address: DAVE }),
            votingPower: 100n,
          },
        ],
      },
      {
        voter: expect.objectContaining({ address: EVE }),
        votingPower: 200n,
        votingPowerFromAllDelegators: 100n,
        votingPowerByDelegator: [
          {
            voter: expect.objectContaining({ address: BOB }),
            votingPower: 100n,
          },
        ],
      },
    ]);
  });
});
