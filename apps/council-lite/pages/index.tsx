import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiClient } from "src/clients/wagmi";
import { chains } from "src/provider";
import { WagmiConfig } from "wagmi";

export default function Web() {
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
                className="daisy-menu daisy-menu-compact daisy-dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
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
            <a className="daisy-btn daisy-btn-ghost normal-case text-xl">
              council-lite
            </a>
          </div>
          <div className="daisy-navbar-center hidden lg:flex">
            <ul className="daisy-menu daisy-menu-horizontal p-0">
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
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
