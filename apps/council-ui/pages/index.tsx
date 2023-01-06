import "@rainbow-me/rainbowkit/styles.css";
import { ReactElement } from "react";

export default function Index(): ReactElement {
  return (
    <div className="m-auto">
      <div className="flex flex-col max-w-5xl p-24 m-auto gap-y-8">
        <h1 className="text-5xl text-accent-content">
          <span className="text-accent">Council</span> is a decentralized
          governance system that allows a community to manage a DAO.
        </h1>
        <p className="text-2xl">
          The <span className="text-secondary">governance </span>system is
          designed to enable flexibility, improvements, and experimentation
          while successfully maintaining the security and robustness of the
          governed protocol.
        </p>
        <div className="space-x-4">
          {/* <Link href="/proposals">
            <button className="daisy-btn daisy-btn-accent">Open App</button>
          </Link> */}
          {/* <a
            href="https://github.com/element-fi/council-monorepo"
            rel="noopener noreferrer"
            target="_blank"
          >
            <button className="daisy-btn daisy-btn-secondary">Github</button>
          </a> */}
        </div>
      </div>

      <div className="w-full p-24 bg-base-300">
        <div className="max-w-5xl">
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-medium">Get Started</div>
            <div className="text-xl text-center">
              Build Defi apps and tools on the largest crypto project on
              Ethereum. Get started with quick start guides, protocol
              documentation, a Javascript SDK, and fully open source code.{" "}
            </div>

            <div className="daisy-mockup-code">
              <pre data-prefix="$">
                {/* <code>git clone https://github.com/delve/council-monorepo</code> */}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-24">
        <div className="max-w-5xl">
          {" "}
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-medium">Why use Council?</div>
            <div className="text-xl font-medium text-center">
              Council is a decentralized governance system on the Ethereum
              mainnet blockchain that allows a community to manage a DAO.{" "}
            </div>
            <div className="flex gap-8">
              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Voting Vaults</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                </div>
              </div>

              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">GSC</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                </div>
              </div>

              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Core Voting</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-24 bg-base-300">
        <div className="max-w-5xl">
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-medium">Council 🤝 DAOs </div>

            <div className="flex gap-8">
              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="text-center daisy-card-body">
                  <h2 className="daisy-card-title">Coordinape</h2>
                  <div className="text-6xl">👻</div>
                </div>
              </div>
              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="text-center daisy-card-body">
                  <h2 className="daisy-card-title">Coordinape</h2>
                  <div className="text-6xl">👻</div>
                </div>
              </div>

              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="text-center daisy-card-body">
                  <h2 className="daisy-card-title">Coordinape</h2>
                  <div className="text-6xl">👻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-5xl p-24 m-auto text-center gap-y-8">
        <div className="text-5xl font-medium">
          Built with ❤️ and 🧠 by <span className="text-secondary">Delve</span>
        </div>
        <div className="text-lg">
          Building RainbowKit has been an incredibly fun effort across many
          people at Rainbow and our frens at other companies. We &apos; re
          always looking to make RainbowKit better, so please let us know how we
          can improve.
        </div>
        {/* <div className="text-xs">stolen from raindbow kit</div> */}
      </div>
    </div>
  );
}
