import { BigNumber, ethers, Wallet } from "ethers";
import { stubContract } from "./stubContract";
import { MockProvider } from "@wagmi/connectors/mock";
import { ApprovalEvent } from "@council/typechain/dist/contracts/interfaces/IERC20";
import { stub } from "sinon";
import { ERC20, ERC20__factory } from "src/types";
import { test, expect } from "@jest/globals";

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
  const gasToApprove100Tokens = await stubbedContract.estimateGas.approve(
    ethers.constants.AddressZero,
    100,
  );
  expect(gasToApprove100Tokens).toEqual(BigNumber.from(555));
});

test("Stubs popoulateTransaction methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(() =>
    stubbedContract.populateTransaction.approve(
      ethers.constants.AddressZero,
      100,
    ),
  ).toThrow();

  stubbedContract.populateTransaction.approve.resolves({});
  const approveTx = await stubbedContract.populateTransaction.approve(
    ethers.constants.AddressZero,
    100,
  );
  expect(approveTx).toEqual({});
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
  const privateKey = process.env.MOCK_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw "Missing environment variable: MOCK_WALLET_PRIVATE_KEY";
  }
  const mockProvider = new MockProvider({
    chainId: 1,
    signer: new Wallet(privateKey),
  });

  return stubContract<ERC20>(
    ERC20__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}
