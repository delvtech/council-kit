import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { wagmiClient } from "src/clients/wagmi";
import { chains } from "src/provider";
import { WagmiConfig } from "wagmi";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="daisy-navbar bg-base-100">
          <div className="daisy-navbar-start">
            <div className="daisy-dropdown">
              <label
                tabIndex={0}
                className="daisy-btn daisy-btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="p-2 mt-3 shadow daisy-menu daisy-menu-compact daisy-dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>proposals</a>
                </li>
                <li>
                  <a>vaults</a>
                </li>
                <li>
                  <a>voters</a>
                </li>
                <li>
                  <a>profile</a>
                </li>
              </ul>
            </div>
            <a className="text-xl normal-case daisy-btn daisy-btn-ghost">
              council-ui
            </a>
          </div>
          <div className="hidden daisy-navbar-center lg:flex">
            <ul className="p-0 daisy-menu daisy-menu-horizontal">
              <li>
                <a>proposals</a>
              </li>
              <li>
                <a>vaults</a>
              </li>
              <li>
                <a>voters</a>
              </li>
              <li>
                <a>profile</a>
              </li>
            </ul>
          </div>
          <div className="daisy-navbar-end">
            <ConnectButton />
          </div>
        </div>
        <main>
          <Component {...pageProps} />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
