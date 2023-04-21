// TODO: Testing breaks when named imports are used for this package
import contractStub from "@council/contract-stub";
import { VestingVault__factory } from "@council/typechain";
import { VestingVaultStorage } from "@council/typechain/dist/contracts/mocks/TestVestingVault";
import { expect, test } from "@jest/globals";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { mockProvider } from "src/testing/mockProvider";
import { VestingVaultContractDataSource } from "./VestingVaultContractDataSource";

test("Fetches token correctly", async () => {
  const vaultContract = setupMockVault();
  vaultContract.token.resolves("0x0");

  const context = new CouncilContext(mockProvider);
  const dataSource = new VestingVaultContractDataSource(vaultContract, context);
  const value = await dataSource.getToken();

  expect(value).toEqual("0x0");
});

test("Fetches unvested multiplier correctly", async () => {
  const vaultContract = setupMockVault();
  vaultContract.unvestedMultiplier.resolves(BigNumber.from(0));

  const context = new CouncilContext(mockProvider);
  const dataSource = new VestingVaultContractDataSource(vaultContract, context);
  const value = await dataSource.getUnvestedMultiplier();

  expect(value).toEqual(0);
});

test("Fetches grants correctly", async () => {
  const vaultContract = setupMockVault();
  const mockGrant = setupMockGrant();
  vaultContract.getGrant.resolves(mockGrant);

  const context = new CouncilContext(mockProvider);
  const dataSource = new VestingVaultContractDataSource(vaultContract, context);
  const value = await dataSource.getGrant("0x0");

  expect(value).toEqual({
    allocation: formatEther(mockGrant.allocation),
    withdrawn: formatEther(mockGrant.withdrawn),
    startBlock: mockGrant.created.toNumber(),
    expirationBlock: mockGrant.expiration.toNumber(),
    unlockBlock: mockGrant.cliff.toNumber(),
    votingPower: formatEther(mockGrant.latestVotingPower),
    delegate: mockGrant.delegatee.toString(),
    range: mockGrant.range.map((bn) => formatEther(bn)),
  });
});

test("Fetches delegate correctly", async () => {
  const vaultContract = setupMockVault();
  const mockGrant = setupMockGrant();
  vaultContract.getGrant.resolves(mockGrant);

  const context = new CouncilContext(mockProvider);
  const dataSource = new VestingVaultContractDataSource(vaultContract, context);
  const value = await dataSource.getDelegate("0x0");

  expect(value).toEqual(mockGrant.delegatee.toString());
});

function setupMockVault() {
  return contractStub.stubContract(
    VestingVault__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}

function setupMockGrant() {
  const mockGrant = [
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    "0x0000000000000000000000000000000000000000",
    [BigNumber.from(0), BigNumber.from(1)],
  ] as unknown as VestingVaultStorage.GrantStructOutput;

  mockGrant.allocation = mockGrant[0];
  mockGrant.withdrawn = mockGrant[1];
  mockGrant.created = mockGrant[2];
  mockGrant.expiration = mockGrant[3];
  mockGrant.cliff = mockGrant[4];
  mockGrant.latestVotingPower = mockGrant[5];
  mockGrant.delegatee = mockGrant[6];
  mockGrant.range = mockGrant[7];

  return mockGrant;
}
