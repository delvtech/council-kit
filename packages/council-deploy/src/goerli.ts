import { Wallet } from "ethers";
import hre from "hardhat";
import { writeFile } from "src/base/writeFile";
import { deployCouncil } from "src/deployCouncil";

const goerliKey = process.env.GOERLI_DEPLOYER_PRIVATE_KEY;

async function main() {
  const provider = hre.ethers.provider;
  if (!goerliKey) {
    console.log("no private key for goerli deployer address provided");
    return;
  }
  const signer = new Wallet(goerliKey, provider);

  const councilAddresses = await deployCouncil(signer);
  console.log(councilAddresses);

  writeFile(
    {
      chainId: 5,
      addresses: councilAddresses,
    },
    `./dist/goerli.${Date.now()}.addresses.json`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
