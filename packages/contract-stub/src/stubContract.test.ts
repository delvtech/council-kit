import { BigNumber, ethers } from "ethers";
import { stubContract } from "./stubContract";
import { ApprovalEvent } from "@council/typechain/dist/contracts/interfaces/IERC20";
import { stub } from "sinon";
import { ERC20__factory } from "src/testing/types";
import { test, expect } from "@jest/globals";
import { mockProvider } from "src/testing/mockProvider";

test("Stubs methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(stubbedContract.decimals).toThrow();

  stubbedContract.decimals.resolves(18);
  const decimals = await stubbedContract.decimals();
  expect(decimals).toEqual(18);
});

test("Stubs functions methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(stubbedContract.functions.decimals).toThrow();

  stubbedContract.functions.decimals.resolves([18]);
  const decimals = await stubbedContract.functions.decimals();
  expect(decimals).toEqual([18]);
});

test("Stubs callStatic methods correctly", async () => {
  const stubbedContract = setupMockERC20();
  // should throw an error if stub's resolve value was never set
  expect(stubbedContract.callStatic.approve).toThrow();

  stubbedContract.callStatic.approve.resolves(true);
  const gasToApprove100Tokens = await stubbedContract.callStatic.approve(
    ethers.constants.AddressZero,
    100,
  );
  expect(gasToApprove100Tokens).toEqual(true);
});

test("Stubs estimateGas methods correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(stubbedContract.estimateGas.approve).toThrow();

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
  expect(stubbedContract.populateTransaction.approve).toThrow();

  stubbedContract.populateTransaction.approve.resolves({});
  const approveTx = await stubbedContract.populateTransaction.approve(
    ethers.constants.AddressZero,
    100,
  );
  expect(approveTx).toEqual({});
});

test("Stubs queryFilter correctly", async () => {
  const stubbedContract = setupMockERC20();

  // should throw an error if stub's resolve value was never set
  expect(stubbedContract.queryFilter).toThrow();

  const getBlockStub = stub().resolves(12345678);

  stubbedContract.queryFilter.resolves([
    {
      args: [],
      getBlock: getBlockStub,
    },
  ] as unknown as ApprovalEvent[]);

  const filter = stubbedContract.filters.Approval();
  const approvalEvents = await stubbedContract.queryFilter(filter);

  expect(approvalEvents).toEqual([
    {
      args: [],
      getBlock: getBlockStub,
    },
  ]);
});

test("Stubs connect correctly", async () => {
  const stubbedContract = setupMockERC20();
  stubbedContract.decimals.resolves(18);

  const newInstance = stubbedContract.connect(mockProvider);
  const newInstanceDecimals = await newInstance.decimals();

  // should keep mocks from original
  expect(newInstanceDecimals).toEqual(18);

  // shouldn't be affected by changes to non-mock properties on the original
  // instance
  Object.assign(stubbedContract, { address: "0x1" });
  expect(newInstance.address).not.toEqual(stubbedContract.address);
});

function setupMockERC20() {
  return stubContract(
    ERC20__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}
