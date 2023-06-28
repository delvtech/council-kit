import { VestingVault__factory } from "@council/typechain";
import signale from "signale";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

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
  return encodeFunctionData({
    abi: VestingVault__factory.abi,
    functionName: "acceptGrant",
  });
}
