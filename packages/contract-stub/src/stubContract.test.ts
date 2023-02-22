import { BigNumber, ethers, Wallet } from "ethers";
import { stubContract } from "./stubContract";
import { MockProvider } from "@wagmi/connectors/mock";
import { ApprovalEvent } from "@council/typechain/dist/contracts/interfaces/IERC20";
import { stub } from "sinon";
import { ERC20, ERC20__factory } from "src/types";
import { test, expect } from "vitest";

test("Stubs callStatic methods correctly", async () => {
  const stubbedContract = setupMockERC20();
  // should throw an error if stub's resolve value was never set
  expect(() => stubbedContract.callStatic.decimals()).toThrow();

  stubbedContract.callStatic.decimals.resolves(18);
  const decimals = await stubbedContract.callStatic.decimals();
  expect(decimals).toEqual(18);
});

test("Stubs functions methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(() => stubbedContract.functions.decimals()).toThrow();

  stubbedContract.functions.decimals.resolves([18]);
  const decimals = await stubbedContract.functions.decimals();
  expect(decimals).toEqual([18]);
});

test("Stubs estimateGas methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(() =>
    stubbedContract.estimateGas.approve(ethers.constants.AddressZero, 100),
  ).toThrow();

  stubbedContract.estimateGas.approve.resolves(BigNumber.from(555));
  const gasToBurn100Tokens = await stubbedContract.estimateGas.approve(
    ethers.constants.AddressZero,
    100,
  );
  expect(gasToBurn100Tokens).toEqual(BigNumber.from(555));
});

test("Stubs queryFilter correctly", async () => {
  const stubbedContract = setupMockERC20();

  const filter = stubbedContract.filters.Approval();

  // should throw an error if stub's resolve value was never set
  expect(() => stubbedContract.queryFilter(filter)).toThrow();

  const getBlockStub = stub().resolves(12345678);

  stubbedContract.queryFilter.resolves([
    {
      args: [],
      getBlock: getBlockStub,
    },
  ] as unknown as ApprovalEvent[]);
  const approvalEvents = await stubbedContract.queryFilter(filter);
  expect(approvalEvents).toEqual([
    {
      args: [],
      getBlock: getBlockStub,
    },
  ]);
});

function setupMockERC20() {
  const mockProvider = new MockProvider({
    chainId: 1,
    signer: new Wallet(
      "d1b0c40a9943d53459302ccf9003ef9666b9235dfc3220ea1f0422a886615511",
    ),
  });

  return stubContract<ERC20>(
    ERC20__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}
