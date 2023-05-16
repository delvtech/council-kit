import { VestingVault__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "accept-grant [OPTIONS]",
    aliases: ["acceptGrant"],
    describe: "Encode call data for VestingVault.acceptGrant",

    handler: () => {
      signale.success(encodeAcceptGrant());
    },
  });

export function encodeAcceptGrant(): string {
  const lockingVaultInterface = new Interface(VestingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("acceptGrant", []);
}
