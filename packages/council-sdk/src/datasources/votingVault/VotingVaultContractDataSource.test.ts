// TODO: Testing breaks when named imports are used for this package
import contractStub from "@council/contract-stub";
import { IVotingVault__factory } from "@council/typechain";
import { expect, test } from "@jest/globals";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import { mockProvider } from "src/testing/mockProvider";
import { VotingVaultContractDataSource } from "./VotingVaultContractDataSource";

test("Fetches voting power correctly", async () => {
  const vaultContract = setupMockVault();
  const votingPower = parseEther("100");
  vaultContract.callStatic.queryVotePower.resolves(votingPower);

  const context = new CouncilContext(mockProvider);
  const dataSource = new VotingVaultContractDataSource(vaultContract, context);
  const value = await dataSource.getVotingPower("0x0");

  expect(parseEther(value)).toEqual(votingPower);
});

function setupMockVault() {
  return contractStub.stubContract(
    IVotingVault__factory.connect(ethers.constants.AddressZero, mockProvider),
  );
}
