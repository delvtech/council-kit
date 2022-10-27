import { Button } from "ui";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { wagmiClient } from "src/clients/wagmi";
import { chains } from "src/provider";

export default function Web() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div>
          <h1 className="font-bold">Web</h1>
          <Button />
          <ConnectButton />
          <button className="btn btn-primary">Button</button>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
