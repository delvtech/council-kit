import { MockERC20 } from "@council/typechain";
import { ContractReceipt } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import prompt from "prompt";
import { makeGoerliTransactionUrl } from "src/etherscan/urls";

/**
 * Mints tokens to the recipient. The amount to mint is given via an interactive
 * prompt.
 */
export async function promptMint(
  tokenContract: MockERC20,
  recipientAddress: string,
): Promise<ContractReceipt> {
  const tokenDecimals = await tokenContract.decimals();
  const tokenSymbol = await tokenContract.symbol();
  const currentBalance = formatUnits(
    await tokenContract.balanceOf(recipientAddress),
    tokenDecimals,
  );
  const { amountToMint } = await prompt.get({
    description: `Amount to mint (Current balance: ${currentBalance} ${tokenSymbol})`,
    name: "amountToMint",
    type: "string",
    default: "100",
    required: true,
  });

  const tx = await tokenContract.mint(
    recipientAddress,
    parseUnits(amountToMint as string, tokenDecimals),
  );

  console.log("Mint submitted, waiting 1 confirmation...");
  const minedTx = await tx.wait(1);

  console.log(`Mint confirmed! ${tx.hash}`);

  return minedTx;
}
