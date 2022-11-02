import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chains } from "src/provider";

export const { connectors } = getDefaultWallets({
  appName: "Council UI",
  chains,
});
