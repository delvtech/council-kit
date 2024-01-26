import { expect, test } from "vitest";
import { ContractEvent } from "src/contract/ContractEvents";
import { ReadContractStub } from "src/contract/stubs/ReadContractStub/ReadContractStub";
import { ALICE, BOB, NANCY } from "src/base/testing/accounts";
import { IERC20 } from "src/base/IERC20";
const ERC20ABI = IERC20.abi;
test("It stubs the read function", async () => {
  const contract = new ReadContractStub(IERC20.abi);

  expect(() => contract.read("balanceOf", [])).toThrowError();

  // Stub bob and alice's balances first
  const bobArgs = [BOB] as const;
  const bobValue = [10n] as const;
  contract.stubRead({
    functionName: "balanceOf",
    args: bobArgs,
    value: bobValue,
  });

  const aliceArgs = [ALICE] as const;
  const aliceValue = [20n] as const;
  contract.stubRead({
    functionName: "balanceOf",
    args: aliceArgs,
    value: aliceValue,
  });

  // Now try and read them based on their args
  const bobResult = await contract.read("balanceOf", [BOB]);
  const aliceResult = await contract.read("balanceOf", [ALICE]);
  expect(bobResult).toBe(bobValue);
  expect(aliceResult).toBe(aliceValue);

  // Now stub w/out any args and see if we get the default value back
  const defaultValue = [30n] as const;
  contract.stubRead({
    functionName: "balanceOf",
    value: defaultValue,
  });
  const defaultResult = await contract.read("balanceOf", [NANCY]);
  expect(defaultResult).toBe(defaultValue);

  const stub = contract.getReadStub("balanceOf");
  expect(stub?.callCount).toBe(3);
});

test("It stubs the simulateWrite function", async () => {
  const contract = new ReadContractStub(ERC20ABI);

  expect(() =>
    contract.simulateWrite("transferFrom", {
      from: ALICE,
      to: BOB,
      value: 100n,
    }),
  ).toThrowError();

  const stubbedResult = [true] as const;
  contract.stubWrite("transferFrom", [true]);

  const result = await contract.simulateWrite("transferFrom", {
    from: ALICE,
    to: BOB,
    value: 100n,
  });

  expect(result).toStrictEqual(stubbedResult);

  const stub = contract.getWriteStub("transferFrom");
  expect(stub?.callCount).toBe(1);
});

test("It stubs the getEvents function", async () => {
  const contract = new ReadContractStub(ERC20ABI);

  expect(() => contract.getEvents("Transfer")).toThrowError();

  const stubbedEvents: ContractEvent<typeof ERC20ABI, "Transfer">[] = [
    {
      eventName: "Transfer",
      args: {
        to: ALICE,
        from: BOB,
        value: 100n,
      },
      blockNumber: 1n,
      data: "0x123abc",
      transactionHash: "0x123abc",
    },
  ];
  contract.stubEvents("Transfer", stubbedEvents);

  const events = await contract.getEvents("Transfer");
  expect(events).toBe(stubbedEvents);

  const stub = contract.getEventsStub("Transfer");
  expect(stub?.callCount).toBe(1);
});
