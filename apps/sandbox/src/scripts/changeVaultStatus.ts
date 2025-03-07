import { ReadWriteCouncil } from "@delvtech/council-js";
import { council } from "src/client";

if (!(council instanceof ReadWriteCouncil)) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const coreVoting = council.coreVoting("0x"); // <-- replace address

const hash = await coreVoting.changeVaultStatus({
  args: {
    vault: "0x", // <-- replace address
    isValid: true,
  },
  options: {
    onMined: (receipt) => {
      console.log("Transaction receipt:", receipt);
    },
  },
});

console.log("Transaction submitted:", hash);

process.exit();
