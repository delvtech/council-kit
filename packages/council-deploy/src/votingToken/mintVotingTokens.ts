import { CoreVoting__factory, MockERC20__factory } from "@council/typechain";
import { Wallet } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import hre from "hardhat";
import prompt from "prompt";
import goerliDeployments from "src/deployments/goerli.deployments.json";
import { makeGoerliTransactionUrl } from "src/etherscan/urls";
import { formatVotingTokenTable } from "src/votingToken/formatVotingTokenTable";

const goerliKey = process.env.GOERLI_DEPLOYER_PRIVATE_KEY;

const votingTokenList = formatVotingTokenTable(goerliDeployments.deployments);

async function mintVotingTokens() {
  const provider = hre.ethers.provider;
  if (!goerliKey) {
    console.log("no private key for goerli deployer address provided");
    return;
  }

  const signer = new Wallet(goerliKey, provider);

  console.table(votingTokenList);
  prompt.start();
  const { votingTokenIndex } = await prompt.get({
    description: "Choose a token (index number)",
    name: "votingTokenIndex",
    enum: [...votingTokenList.map((_, i) => i)],
    type: "number",
    required: true,
  });

  const votingTokenAddress =
    votingTokenList[votingTokenIndex as number]["Contract Address"];

  const votingTokenContract = MockERC20__factory.connect(
    votingTokenAddress,
    signer,
  );

  const { recipientAddress } = await prompt.get({
    description:
      "Enter the recipient's address (Defaults to Goerli Deployer from .env)",
    name: "recipientAddress",
    type: "string",
    default: signer.address,
    required: true,
  });

  const tokenDecimals = await votingTokenContract.decimals();
  const tokenSymbol = await votingTokenContract.symbol();
  const currentBalance = formatUnits(
    await votingTokenContract.balanceOf(recipientAddress as string),
    tokenDecimals,
  );

  const { amountToMint } = await prompt.get({
    description: `Amount to mint (Current balance: ${currentBalance} ${tokenSymbol})`,
    name: "amountToMint",
    type: "string",
    default: "100",
    required: true,
  });

  console.log(`Minting ${amountToMint} tokens...`);
  const tx = await votingTokenContract.mint(
    recipientAddress as string,
    parseUnits(amountToMint as string, tokenDecimals),
  );
  console.log(
    `Transaction submitted, waiting for it to be mined...`,
    `(View pending tx on etherscan: ${makeGoerliTransactionUrl(tx.hash)})`,
  );

  await tx.wait(1);
  const newBalance = formatUnits(
    await votingTokenContract.balanceOf(recipientAddress as string),
    tokenDecimals,
  );
  console.log(`Transaction success! New balance: ${newBalance} ${tokenSymbol}`);
  console.log(`View on etherscan: ${makeGoerliTransactionUrl(tx.hash)}`);
}

mintVotingTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
