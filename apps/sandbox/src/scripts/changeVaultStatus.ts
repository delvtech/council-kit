import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, publicClient } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace address

const hash = await coreVoting.changeVaultStatus({
  args: {
    vault: "0x", // <-- replace address
    isValid: true,
  },
});
console.log("Transaction submitted:", hash);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Transaction receipt:", receipt);

process.exit();
