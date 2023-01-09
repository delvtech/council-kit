import "@rainbow-me/rainbowkit/styles.css";
import Link from "next/link";
import { ReactElement } from "react";

export default function Index(): ReactElement {
  return (
    <div className="m-auto">
      <div className="flex flex-col max-w-5xl p-24 m-auto gap-y-8">
        <h1 className="text-5xl text-accent-content">
          <span className="text-accent">Council</span> is a decentralized
          governance protocol that allows a community to manage a DAO.
        </h1>
        <p className="text-2xl">
          A <span className="text-secondary">governance </span>A governance system designed to be modular and adaptable.
          Council is here to reinvigorate the standard model for governance that keeps decentralization at the forefront           and allows DAOs to scale decision making. 
        </p>
        <div className="space-x-4">
          <Link href="/proposals">
            <button className="daisy-btn daisy-btn-accent">Open App</button>
          </Link>
          <a
            href="https://github.com/element-fi/council-monorepo"
            rel="noopener noreferrer"
            target="_blank"
          >
            <button className="daisy-btn daisy-btn-secondary">Github</button>
          </a>
        </div>
      </div>

      <div className="w-full p-24 bg-base-300">
        <div className="max-w-5xl">
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-medium">Get Started</div>
            <div className="text-xl text-center">
              Get up and running with Council with our quick start guides, protocol documentation, a fully customizable reference UI, a Javascript SDK, and fully open source code. {" "}
            </div>

            <div className="daisy-mockup-code">
              <pre data-prefix="$">
                <code>git clone https://github.com/delve/council-monorepo</code>
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
              Council Protocol was created because there are no governance frameworks that exist today that meet the               realistic needs of day-to-day and long-term governance. {" "}
            </div>
            <div className="flex gap-8">
              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Voting Vaults</h2>
                  <p>Grow your DAOs Inclusivity. Assign voting power to any use case.</p>
                </div>
              </div>

              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">GSC</h2>
                  <p>Scale Decision Making with the Governance Steering Council, elected through a delegation                             threshold.</p>
                </div>
              </div>

              <div className="w-48 daisy-card bg-primary text-primary-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Core Voting</h2>
                  <p>This system begins with the core…and the core is all that is needed at the base layer. Nothing                          more, nothing less. The Core simply consists of: 
                      - Defining the voting process for those with governance power.
                      - Tracking proposals and counting voting power.
                      - Retrieving user voting power from approved Voting Vaults.
                  </p>
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
          Building Council has been an absolute pleasure and we couldn't have done it without the feedback and support             from you all. We're always looking to make Council better, so please let us know how we can continue to                 improve or ask how you can start contributing. 
        </div>
      </div>
    </div>
  );
}
