import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { reactQueryClient } from "src/clients/reactQuery";
import { wagmiClient } from "src/clients/wagmi";
import { councilConfigs } from "src/config/council.config";
import { chains } from "src/provider";
import { CouncilClientProvider } from "src/ui/council/CouncilProvider";
import { Navigation } from "src/ui/navigation/Navigation";
import { WagmiConfig } from "wagmi";

console.log(councilConfigs);

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={reactQueryClient}>
          <CouncilClientProvider>
            <Navigation />
            <main>
              <Component {...pageProps} />
            </main>
            <Toaster />
          </CouncilClientProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
