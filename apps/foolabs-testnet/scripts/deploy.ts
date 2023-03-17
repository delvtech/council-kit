import { ethers } from "hardhat";
import { ScoreVault__factory } from "@foolabs/typechain";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0];

  const scoreVaultFactory = new ScoreVault__factory(signer);
  const scoreVault = await scoreVaultFactory.deploy();

  await scoreVault.authorize(signer.address);

  const deployMetaPath = path.join(__dirname, "../deploy");

  if (!fs.existsSync(deployMetaPath)) {
    fs.mkdirSync(deployMetaPath);
  }

  fs.writeFileSync(
    path.join(deployMetaPath, "addresses.json"),
    JSON.stringify({
      scoreVault: scoreVault.address,
    }),
    {}
  );

  console.log(`ScoreVault deployed to ${scoreVault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
