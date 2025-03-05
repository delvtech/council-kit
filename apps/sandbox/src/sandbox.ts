import { council } from "src/client";

const gscVault = council.gscVault("0xcA870E8aa4FCEa85b5f0c6F4209C8CBA9265B940");
const vaults = await gscVault.getMemberVaults(
  "0x16C0a9C9967d8e860bf84596769ef513dd6f2094",
);
console.log("vaults: ", vaults);
