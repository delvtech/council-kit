import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { councilConfigs } from "src/config/council.config";
import { wagmiConfig } from "src/lib/rainbowKit";
import { reactQueryClient } from "src/lib/reactQuery";
import { makeTOSAndPrivacyPolicyToast } from "src/ui/base/toast/makeTOSAndPrivacyPolicyToast";
import { getLocalStorage } from "src/ui/base/getLocalStorage";
import { Navigation } from "src/ui/navigation/Navigation";
import { WagmiProvider } from "wagmi";

console.log(councilConfigs);

function App({ Component, pageProps }: AppProps): ReactElement {
  useToastTOSAndPrivacyPolicy();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={reactQueryClient}>
        <RainbowKitProvider>
          <Toaster />
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" type="image/svg+xml" href="/Element-Dark.png" />
            <title>Element DAO</title>
            <meta
              name="description"
              content="The Element DAO governance portal allows for anyone to view and vote on governance proposals, view voter profiles, and use voting vaults."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@Element_DAO" />
            <meta name="twitter:title" content="Element DAO" />
            <meta
              name="twitter:description"
              content="The Element DAO governance portal allows for anyone to view and vote on governance proposals, view voter profiles, and use voting vaults."
            />
            <meta
              name="twitter:image"
              content="https://i.imgur.com/Re5IWfX.png"
            />

            <meta property="og:type" content="article" />
            <meta property="og:title" content="Element DAO" />
            <meta
              property="og:description"
              content="The Element DAO governance portal allows for anyone to view and vote on governance proposals, view voter profiles, and use voting vaults."
            />
            <meta property="og:url" content="https://governance.element.fi" />
            <meta
              property="og:image"
              content="https://i.imgur.com/Re5IWfX.png"
            />
          </Head>
          <Navigation />
          <main>
            <Component {...pageProps} />
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
function useToastTOSAndPrivacyPolicy() {
  const { setItem, getItem } = getLocalStorage();

  useEffect(() => {
    if (!getItem("approve-tos-and-privacy-policy")) {
      makeTOSAndPrivacyPolicyToast({
        onAgreeClick: () =>
          setItem("approve-tos-and-privacy-policy", JSON.stringify(true)),
      });
    }
    // Only do this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
