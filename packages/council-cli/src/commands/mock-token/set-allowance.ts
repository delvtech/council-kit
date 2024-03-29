import { ReadWriteMockToken } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description: "Set an account's token allowance",

  options: {
    address: {
      description: "The token contract address",
      type: "string",
      required: true,
    },
    owner: {
      description: "The address of the token owner",
      type: "string",
      required: true,
    },
    spender: {
      description: "The address of the token spender",
      type: "string",
      required: true,
    },
    allowance: {
      description:
        "The amount of tokens the spender is allowed to spend from the owner's account",
      type: "string",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, context, next }) => {
    const {
      account: signerAccount,
      chain,
      rpcUrl,
    } = await getWriteOptions(options, context);

    const address = await options.address({
      prompt: "Enter token contract address",
    });

    const owner = await options.owner({
      prompt: "Enter the token owner's address",
    });

    const spender = await options.spender({
      prompt: "Enter the token spender's address",
    });

    const allowance = await options.allowance({
      prompt: {
        message:
          "Enter amount of tokens the spender is allowed to spend from the owner's account",
        initial: "0.0",
      },
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({
      transport,
      chain,
      account: signerAccount,
    });

    const token = new ReadWriteMockToken({
      address: address as `0x${string}`,
      publicClient,
      walletClient,
    });

    const decimals = await token.getDecimals();
    const hash = await token.setAllowance({
      allowance: parseUnits(allowance, decimals),
      spender: spender as `0x${string}`,
      owner: owner as `0x${string}`,
    });

    signale.success(hash);
    next(hash);
  },
});
