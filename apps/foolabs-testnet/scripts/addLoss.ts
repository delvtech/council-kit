import { ScoreVault } from "@foolabs/vaults";
import addresses from "../deploy/addresses.json";
import { CouncilContext } from "@council/sdk";
import { ethers } from "hardhat";

const POINTS = 25;

async function main() {
  const address = addresses.scoreVault;
  const signers = await ethers.getSigners();
  const signer = signers[0];

  const context = new CouncilContext(ethers.provider);
  const scoreVault = new ScoreVault(address, context);

  console.log("Adding loss...");

  const tx = await scoreVault.addLoss(signer.address, POINTS, signer);

  console.log(`Awarded loss worth ${POINTS} points to ${signer.address}`);
  console.log(`Transaction Hash: ${tx}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
