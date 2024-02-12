import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { Tooltip, TooltipProvider } from "react-tooltip";
import { councilConfigs } from "src/config/council.config";
import { wagmiConfig } from "src/lib/rainbowKit";
import { reactQueryClient } from "src/lib/reactQuery";
import { Navigation } from "src/ui/navigation/Navigation";
import { WagmiProvider } from "wagmi";

console.log(councilConfigs);

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={reactQueryClient}>
        <RainbowKitProvider>
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
