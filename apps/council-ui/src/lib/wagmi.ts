import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { SupportedChainId } from "src/config/council.config";
import { HttpTransport } from "viem";
import { http } from "wagmi";
import { anvil, Chain, goerli, mainnet } from "wagmi/chains";

export const chains: {
  [ChainId in SupportedChainId]: Chain & { id: ChainId };
} = {
  1: mainnet,
  5: goerli,
  31337: anvil,
};

export const transports: Record<SupportedChainId, HttpTransport> = {
  1: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
  5: http(process.env.NEXT_PUBLIC_GOERLI_RPC_URL),
  31337: http(process.env.NEXT_PUBLIC_LOCAL_RPC_URL),
};

const wallets = [injectedWallet, safeWallet, rainbowWallet, metaMaskWallet];
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (walletConnectId) {
  wallets.push(walletConnectWallet);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "Missing WalletConnect project ID. Set the NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID variable in your environment to use WalletConnect.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Council",
  projectId: walletConnectId || "0",
  chains: Object.values(chains) as [Chain, ...Chain[]],
  transports,
  wallets: [
    {
      groupName: "Wallets",
      wallets,
    },
  ],
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

import { BaseError as BaseViemError, DecodeErrorResultReturnType } from "viem";

/**
 * Parses an viem/wagmi error to get a displayable string
 * @param error - error object
 * @returns parsed error string
 */
export function parseError({ error }: { error: any }): string {
  let message: string = error.message ?? "An unknown error occurred";
  if (error instanceof BaseViemError) {
    if (error.details) {
      message = error.details;
    } else if (error.shortMessage) {
      message = error.shortMessage;
      const cause = error.cause as
        | { data?: DecodeErrorResultReturnType }
        | undefined;
      // if its not generic error, append custom error name and its args to message
      if (cause?.data && cause.data?.errorName !== "Error") {
        const customErrorArgs = cause.data.args?.toString() ?? "";
        message = `${message.replace(/reverted\.$/, "reverted with following reason:")}\n${
          cause.data.errorName
        }(${customErrorArgs})`;
      }
    } else if (error.message) {
      message = error.message;
    } else if (error.name) {
      message = error.name;
    }
  }

  return message;
}
