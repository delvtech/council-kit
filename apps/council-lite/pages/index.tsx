import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiClient } from "src/clients/wagmi";
import { chains } from "src/provider";
import { WagmiConfig } from "wagmi";

export default function Web() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
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
            <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal p-0">
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
          <div className="navbar-end">
            <ConnectButton />
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
