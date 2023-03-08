// TODO: Testing breaks when named imports are used for this package
import contractStub from "@council/contract-stub";
import { MockERC20__factory } from "@council/typechain";
import { expect, test } from "@jest/globals";
import { BigNumber, ethers } from "ethers";
import { CouncilContext } from "src/context/context";
import { mockEvent } from "src/testing/mockEvent";
import { mockProvider } from "src/testing/mockProvider";
import { mockSigner } from "src/testing/mockSigner";
import { mockTransaction } from "src/testing/mockTransaction";
import { ContractDataSource } from "./ContractDataSource";

test("Makes calls correctly", async () => {
  const erc20Contract = setupMockERC20();
  erc20Contract.decimals.resolves(18);

  const context = new CouncilContext(mockProvider);
  const dataSource = new ContractDataSource(erc20Contract, context);
  const value = await dataSource.call("decimals", []);

  expect(value).toEqual(18);
});

test("Uses callStatic correctly", async () => {
  const erc20Contract = setupMockERC20();
  erc20Contract.callStatic.decimals.resolves(18);

  const context = new CouncilContext(mockProvider);
  const dataSource = new ContractDataSource(erc20Contract, context);
  const value = await dataSource.callStatic("decimals", []);

  expect(value).toEqual(18);
});

test("Submits transactions correctly", async () => {
  const erc20Contract = setupMockERC20();
  erc20Contract.approve.resolves(mockTransaction);

  const context = new CouncilContext(mockProvider);
  const dataSource = new ContractDataSource(erc20Contract, context);
  const signerAddress = await mockSigner.getAddress();

  const value = await dataSource.callWithSigner(
    "approve",
    [signerAddress, 100],
    mockSigner,
  );

  expect(value).toEqual(mockTransaction);
});

test("Deletes cached calls correctly", async () => {
  const erc20Contract = setupMockERC20();
  erc20Contract.balanceOf.resolves(BigNumber.from(100));

  const context = new CouncilContext(mockProvider);
  const dataSource = new ContractDataSource(erc20Contract, context);

  await dataSource.call("balanceOf", ["0x0"]);
  dataSource.deleteCall("balanceOf", ["0x1"]);
  await dataSource.call("balanceOf", ["0x0"]);

  expect(erc20Contract.balanceOf.callCount).toBe(1);

  dataSource.deleteCall("balanceOf", ["0x0"]);
  await dataSource.call("balanceOf", ["0x0"]);

  expect(erc20Contract.balanceOf.callCount).toBe(2);
});

test("Gets events correctly", async () => {
  const erc20Contract = setupMockERC20();
  erc20Contract.queryFilter.resolves([mockEvent]);

  const context = new CouncilContext(mockProvider);
  const dataSource = new ContractDataSource(erc20Contract, context);

  const filter = dataSource.contract.filters.Approval();
  const events = await dataSource.getEvents(filter, 0, 1);

  expect(events).toEqual([mockEvent]);
});

function setupMockERC20() {
  return contractStub.stubContract(
    MockERC20__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}
