import { ReadWriteCouncil } from "@delvtech/council-js";
import { council, publicClient } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace address

const hash = await coreVoting.setLockDuration({
  args: {
    blocks: 0n, // <-- replace with the number of blocks to lock
  },
});

console.log("Transaction submitted:", hash);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Transaction receipt:", receipt);

process.exit();
