import Link from "next/link";
import { ReactElement } from "react";

export default function Index(): ReactElement {
  return (
    <div className="m-auto">
      <div className="flex flex-col max-w-5xl md:-24 p-8 m-auto gap-y-8">
        <h1 className="text-5xl font-bold text-accent-content">
          <span className="text-accent">Council</span> is a decentralized
          governance protocol that allows a community to manage a DAO.
        </h1>
        <p className="text-2xl">
          A <span className="text-secondary">governance </span>A governance
          system designed to be modular and adaptable. Council is here to
          reinvigorate the standard model for governance that keeps
          decentralization at the forefront and allows DAOs to scale decision
          making.
        </p>
        <div className="space-x-4">
          <Link href="/proposals">
            <button className="daisy-btn daisy-btn-accent">Open App</button>
          </Link>
          <a
            href="https://github.com/delvtech/council-kit"
            rel="noopener noreferrer"
            target="_blank"
          >
            <button className="daisy-btn daisy-btn-secondary">Github</button>
          </a>
        </div>
      </div>

      <div className="w-full md:p-24 p-8 bg-base-200">
        <div className="max-w-5xl m-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-bold">Get Started</div>
            <div className="text-xl text-center">
              Get up and running with Council with our quick start guides,
              protocol documentation, a fully customizable reference UI, a
              Javascript SDK, and fully open source code.{" "}
            </div>

            <div className="daisy-mockup-code w-full">
              <pre data-prefix="$">
                <code className="w-full">
                  git clone https://github.com/delvtech/council-kit
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:p-24 p-8">
        <div className="max-w-5xl m-auto">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-4xl font-bold">Why use Council?</h1>
            <p className="text-xl text-center">
              Council Protocol was created because there are no governance
              frameworks that exist today that meet the realistic needs of
              day-to-day and long-term governance.
            </p>
            <div className="flex flex-col max-w-md gap-4">
              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Voting Vaults 🗳️</h2>
                  <p>
                    Grow your DAOs Inclusivity. Assign voting power to any use
                    case.
                  </p>
                </div>
              </div>

              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">GSC 🏛️</h2>
                  <p>
                    Scale Decision Making with the Governance Steering Council,
                    elected through a delegation threshold.
                  </p>
                </div>
              </div>

              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Core Voting ⚖️</h2>
                  <p>
                    This system begins with the core…and the core is all that is
                    needed at the base layer. Nothing more, nothing less.
                    {/* <ul className="mt-1 list-disc">
                      <li>
                        Defining the voting process for those with governance
                        power.
                      </li>
                      <li>Tracking proposals and counting voting power.</li>
                      <li>
                        Retrieving user voting power from approved Voting
                        Vaults.
                      </li>
                    </ul> */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:p-24 p-8 bg-base-200">
        <div className="max-w-5xl m-auto">
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-4xl font-medium">Council 🤝 DAOs </h2>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center text-center daisy-card-body">
                  <h2 className="daisy-card-title">Yearn</h2>
                  <img
                    alt="yearn logo"
                    height={80}
                    width={80}
                    src="https://cryptologos.cc/logos/yearn-finance-yfi-logo.png"
                  />
                </div>
              </div>
              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center daisy-card-body">
                  <h2 className="daisy-card-title">Balancer</h2>
                  <img
                    alt="balancer logo"
                    height={80}
                    width={80}
                    src="https://cryptologos.cc/logos/balancer-bal-logo.svg?v=024"
                  />
                </div>
              </div>

              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center daisy-card-body">
                  <h2 className="daisy-card-title">Synthetix</h2>
                  <img
                    alt="snx logo"
                    height={80}
                    width={80}
                    src="https://cryptologos.cc/logos/synthetix-network-token-snx-logo.svg?v=024"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:p-24 p-8">
        <div className="flex flex-col max-w-5xl m-auto text-center gap-y-8">
          <h3 className="md:text-5xl text-3xl font-medium">
            Built with ❤️ and 🧠 by{" "}
            <span className="text-secondary font-bold">Delve</span>
          </h3>
          <p className="text-lg">
            Building Council has been an absolute pleasure and we couldn&apos;t
            have done it without the feedback and support from you all.
            We&apos;re always looking to make Council better, so please let us
            know how we can continue to improve or ask how you can start
            contributing.
          </p>
        </div>
      </div>
    </div>
  );
}
