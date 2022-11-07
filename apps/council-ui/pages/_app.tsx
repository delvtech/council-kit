import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { wagmiClient } from "src/clients/wagmi";
import { chains } from "src/provider";
import { WagmiConfig } from "wagmi";
import "src/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import CouncilLogo from "src/static/council-logo.svg";

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="daisy-navbar bg-base-100">
          <div className="daisy-navbar-start">
            <div className="daisy-dropdown">
              <label
                tabIndex={0}
                className="daisy-btn-ghost daisy-btn lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                className="daisy-dropdown-content daisy-menu rounded-box daisy-menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href="/proposals">proposals</Link>
                </li>
                <li>
                  <Link href="/vaults">vaults</Link>
                </li>
                <li>
                  <Link href="/voters">voters</Link>
                </li>
                <li>
                  <Link href="/profile">profile</Link>
                </li>
              </ul>
            </div>
            <Link href="/">
              <Image alt="Council" src={CouncilLogo} width={200} height={52} />
            </Link>
          </div>
          <div className="daisy-navbar-center hidden lg:flex">
            <ul className="daisy-menu daisy-menu-horizontal p-0">
              <li>
                <Link href="/proposals">proposals</Link>
              </li>
              <li>
                <Link href="/vaults">vaults</Link>
              </li>
              <li>
                <Link href="/voters">voters</Link>
              </li>
              <li>
                <Link href="/profile">profile</Link>
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
