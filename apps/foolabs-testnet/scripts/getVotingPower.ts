import { ScoreVault } from "@foolabs/vaults";
import addresses from "../deploy/addresses.json";
import { CouncilContext } from "@council/sdk";
import { ethers } from "hardhat";

async function main() {
  const address = addresses.scoreVault;
  const signers = await ethers.getSigners();
  const signer = signers[0];

  const context = new CouncilContext(ethers.provider);
  const scoreVault = new ScoreVault(address, context);

  const votingPower = await scoreVault.getVotingPower(signer.address);

  console.log(`Voting power for ${signer.address}: ${votingPower}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
