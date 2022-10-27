// TODO - refactor folder structure

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createClient } from "wagmi";
import { chains, provider } from "./chains";

// explore other wallets
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});
