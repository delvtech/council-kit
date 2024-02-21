import { ReadWriteCouncil } from "@delvtech/council-viem";
import { publicClient, walletClient } from "src/client";

// wrap the script in an async function so we can await promises
export async function changeVaultStatus(): Promise<void> {
  if (!walletClient) {
    throw new Error(
      "Wallet client not available. Ensure the WALLET_PRIVATE_KEY environment variable is set.",
    );
  }

  // create a ReadWriteCouncil instance
  const council = new ReadWriteCouncil({ publicClient, walletClient });

  // Create a ReadWriteCoreVoting instance.
  const coreVoting = council.coreVoting({
    address: "0x", // <-- replace with the CoreVoting contract address
  });

  const hash = await coreVoting.changeVaultStatus({
    vault: "0x", // <-- replace with the vault address
    isValid: true,
  });

  console.log(`Submitted! (${hash})`);

  process.exit();
}

changeVaultStatus();
