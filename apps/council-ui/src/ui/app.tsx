import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { Tooltip, TooltipProvider } from "react-tooltip";
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
            <TooltipProvider>
              <Toaster />
              <Navigation />
              <main>
                <Component {...pageProps} />
              </main>
              {/* Share a single tooltip for the entire app to avoid nasty
              coupling of tooltip and the wrapped component via an `id` prop.
              This follows the recipe in
              https://react-tooltip.com/docs/examples/multiple-anchors */}
              <Tooltip />
            </TooltipProvider>
          </CouncilClientProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
