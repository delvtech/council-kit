import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import cornerLinesLeft from "src/assets/corner-lines-left.svg";
import cornerLinesRight from "src/assets/corner-lines-right.svg";
import elementLogo from "src/assets/element-logo.svg";
import { LinkButton } from "src/ui/Button";
import { Navigation } from "src/ui/Navigation";
import { GitHubIcon } from "src/ui/svg/GitHubIcon";
import { Footer } from "./ui/Footer";

function App(): ReactElement {
  return (
    <>
      <Navigation />
      <img src={cornerLinesLeft} className="absolute top-0 left-0 opacity-30" />

      {/* MAIN */}
      <div className="min-h-screen overflow-hidden text-white bg-dark">
        {/* HERO */}
        <div className="relative">
          <img
            src={cornerLinesRight}
            className="absolute bottom-0 right-0 opacity-20"
          />
          <div className="max-w-6xl box-content box-content px-[4vw] mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] items-center py-10 md:pt-28 md:pb-40 gap-20 justify-items-center">
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-6xl">
                Build adaptable governance systems with{" "}
                <span className="text-primary-text">Council</span>
              </h1>
              <p className="mb-10 text-2xl">
                A governance framework to create and manage DAOs
              </p>
              <div className="flex gap-4">
                <LinkButton href="#" variant="primary">
                  <RocketLaunchIcon className="w-5" />
                  Get started
                </LinkButton>
                <LinkButton
                  href="https://github.com/element-fi/council-kit"
                  target="_blank"
                >
                  <GitHubIcon className="w-5 fill-black" />
                  GitHub
                </LinkButton>
              </div>
            </div>
            <img
              src="/hero-image.png"
              alt="Council hero image"
              className="w-96 lg:w-auto"
            />
          </div>
        </div>

        {/* WHAT IS COUNCIL? */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black h-96"></div>
          <div className="relative max-w-6xl box-content px-[4vw] mx-auto lg:mx-auto py-20">
            <div className="flex flex-col gap-6 mx-auto mb-10 md:max-w-xl md:items-center md:mb-20">
              <h2 className="text-4xl">What is Council?</h2>
              <p className="text-lg">
                Council represents the next evolution of on-chain governance by
                building a smart contract-based modular governance framework.
                These contracts enable builders to use the security of on-chain
                governance while allowing for unprecedented contract
                flexibility.
              </p>
            </div>

            <div className="flex flex-col gap-10 md:flex-row md:gap-20">
              <div className="flex flex-col gap-8 py-6 pt-2 md:gap-14">
                <div className="flex flex-col gap-6 md:items-center">
                  <h3 className="text-2xl font-semibold">Council Protocol</h3>
                  <p>
                    Council Kit goes beyond the smart contracts and positions
                    Council as an all-in-one governance framework. The Council
                    Kit provides smart contract deployment templates and a full.
                  </p>
                </div>
                <div className="flex gap-4 pb-8 border-b border-b-primary-20 md:border-none md:pb-0">
                  <div>
                    <div className="text-3xl text-center w-9">&#9878;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      Core Voting
                    </h4>
                    <p>
                      This system begins with the core…and the core is all that
                      is needed at the base layer. Nothing more, nothing less.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pb-8 border-b border-b-primary-20 md:border-none md:pb-0">
                  <div>
                    <div className="text-3xl text-center w-9">&#x1f5f3;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      Voting Vaults
                    </h4>
                    <p>
                      Grow your DAOs Inclusivity. Assign voting power to any use
                      case.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-3xl text-center w-9">&#127963;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      GSC
                    </h4>
                    <p>
                      Scale Decision Making with the Governance Steering
                      Council, elected through a delegation threshold.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-text opacity-30 w-[1px] hidden md:block"></div>

              <div className="flex flex-col gap-8 pt-2 pb-6 md:gap-14">
                <div className="flex flex-col gap-6 md:items-center">
                  <h3 className="text-2xl font-semibold">Council Kit</h3>
                  <p>
                    Council Kit goes beyond the smart contracts and positions
                    Council as an all-in-one governance framework. The Council
                    Kit provides smart contract deployment templates and a full.
                  </p>
                </div>

                <div className="flex gap-4 pb-8 border-b border-b-primary-20 md:border-none md:pb-0">
                  <div>
                    <div className="text-3xl text-center w-9">&#128640;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      Deploy Template
                    </h4>
                    <p>
                      This system begins with the core…and the core is all that
                      is needed at the base layer. Nothing more, nothing less.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pb-8 border-b border-b-primary-20 md:border-none md:pb-0">
                  <div>
                    <div className="text-3xl text-center w-9">&#127899;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      Reference UI
                    </h4>
                    <p>
                      This system begins with the core…and the core is all that
                      is needed at the base layer. Nothing more, nothing less.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="text-3xl text-center w-9">&#128736;</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-medium leading-9 text-primary-text">
                      SDK
                    </h4>
                    <p>
                      This system begins with the core…and the core is all that
                      is needed at the base layer. Nothing more, nothing less.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GET STARTED */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary-dim h-96 opacity-10"></div>
          <div className="relative flex flex-col gap-11 items-center max-w-[280px] box-content px-[4vw] mx-auto lg:mx-auto py-20">
            <h2 className="text-5xl">Get started</h2>
            <ol className="flex flex-col gap-3 text-xl">
              <li className="flex gap-1">
                <div className="w-6 opacity-50 text-primary-text-light">1.</div>
                Deploy the contracts
              </li>
              <li className="flex gap-1">
                <div className="w-6 opacity-50 text-primary-text-light">2.</div>
                Deploy the UI
              </li>
              <li className="flex gap-1">
                <div className="w-6 opacity-50 text-primary-text-light">3.</div>
                Govern!
              </li>
            </ol>
            <div className="flex flex-col items-stretch w-full gap-4 mt-3">
              <LinkButton href="#" variant="primary">
                <RocketLaunchIcon className="w-5" />
                View the guide
              </LinkButton>
              <LinkButton
                href="https://github.com/element-fi/council"
                target="_blank"
                variant="stroke"
              >
                <GitHubIcon className="w-5 fill-primary-text" />
                View contract code
              </LinkButton>
              <LinkButton
                href="https://github.com/element-fi/council-kit"
                target="_blank"
                variant="stroke"
              >
                <GitHubIcon className="w-5 fill-primary-text" />
                View kit code
              </LinkButton>
            </div>
          </div>
        </div>

        {/* PROJECTS USING COUNCIL */}
        <div className="relative">
          <div className="relative max-w-6xl box-content px-[4vw] mx-auto lg:mx-auto pt-20 pb-28 border-t border-primary-text/30">
            <h2 className="mb-16 text-4xl text-center">
              Projects using Council
            </h2>
            <div className="grid justify-center max-w-2xl grid-cols-1 mx-auto sm:grid-cols-2 gap-14">
              <div className="min-w-max">
                <a
                  href="https://governance.element.fi"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-all hover:scale-105 hover:shadow-lg shadow-dark h-44 flex items-center justify-center p-5 bg-[#1567ca] rounded-2xl"
                >
                  <img src={elementLogo} alt="Element Finance logo" />
                </a>
              </div>
              <div className="min-w-max">
                <a
                  href="https://twitter.com/GyroStable/status/1629157857097654275?s=20"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-all hover:scale-105 hover:opacity-100 hover:shadow-lg shadow-dark h-44 flex items-center justify-center p-5 bg-[#242833]/40 rounded-2xl relative overflow-hidden before:content-[''] before:absolute before:border-[6px] before:border-dashed before:border-primary-text-light/50 before:rounded-[22px] before:inset-[-5px] opacity-50"
                >
                  <img src="/gyroscope-logo.png" width={180} alt="Gyroscope" />
                </a>
                <p className="mt-3 text-center">COMING SOON!</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED BLOG POSTS */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary-dim h-96 opacity-10"></div>
          {/* <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black h-96"></div> */}
          <div className="relative max-w-6xl box-content px-[4vw] mx-auto lg:mx-auto pt-20 pb-28">
            <h2 className="mb-16 text-4xl">Featured blog posts</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="https://messari.io/report/governor-note-evolving-on-chain-governance-with-element-council?referrer=all-research"
                target="_blank"
                rel="noreferrer"
                className="group border border-primary-text-light/20 p-[1px] rounded-2xl bg-[#51466F]/20 hover:border-primary-text-light/50 hover:bg-[#51466F]/40 transition-all"
              >
                <div className="flex items-center justify-center h-44 bg-[#080A0C] rounded-t-[15px] relative">
                  {/* image effects */}
                  {/* <div className="absolute inset-0 shadow-[inset_0_0_40px_currentColor] text-dark opacity-40 transition-all group-hover:opacity-0"></div> */}
                  {/* <div className="absolute inset-0 opacity-50 bg-primary mix-blend-hue group-hover:opacity-0"></div> */}
                  <img
                    src="/messari-logo.png"
                    alt="Messari"
                    className="mw-full"
                  />
                </div>
                <p className="px-6 pt-4 pb-5 font-semibold">
                  Governor Note: Evolving On-Chain Governance With Element
                  Council
                </p>
              </a>
              <a
                href="https://blog.element.fi/voting-vaults-a-new-defi-and-governance-primitive-2/"
                target="_blank"
                rel="noreferrer"
                className="group border border-primary-text-light/20 p-[1px] rounded-2xl bg-[#51466F]/20 hover:border-primary-text-light/50 hover:bg-[#51466F]/40 transition-all"
              >
                <div className="flex items-center justify-center h-44 rounded-t-[15px] overflow-hidden relative">
                  {/* image effects */}
                  {/* <div className="absolute inset-0 shadow-[inset_0_0_40px_currentColor] text-dark opacity-40 transition-all group-hover:opacity-0"></div> */}
                  {/* <div className="absolute inset-0 opacity-50 bg-primary mix-blend-hue group-hover:opacity-0"></div> */}

                  <div className="w-full h-full lg:max-w-none lg:w-auto">
                    <img
                      src="/voting-vaults-banner.png"
                      alt="Voting vaults banner"
                      className="object-cover w-full h-full lg:max-w-none"
                    />
                  </div>
                </div>
                <p className="px-6 pt-4 pb-5 font-semibold">
                  Voting Vaults: A New DeFi and Governance Primitive
                </p>
              </a>
              <a
                href="https://blog.element.fi/the-governance-steering-council/"
                target="_blank"
                rel="noreferrer"
                className="group border border-primary-text-light/20 p-[1px] rounded-2xl bg-[#51466F]/20 hover:border-primary-text-light/50 hover:bg-[#51466F]/40 transition-all"
              >
                <div className="flex items-center justify-center h-44 rounded-t-[15px] overflow-hidden relative">
                  {/* image effects */}
                  {/* <div className="absolute inset-0 shadow-[inset_0_0_40px_currentColor] text-dark opacity-40 transition-all group-hover:opacity-0"></div> */}
                  {/* <div className="absolute inset-0 opacity-50 bg-primary mix-blend-hue group-hover:opacity-0"></div> */}

                  <div className="w-full h-full lg:max-w-none lg:w-auto">
                    <img
                      src="/gsc-article-banner.png"
                      alt="Governance steering council article banner"
                      className="object-cover w-full h-full lg:max-w-none"
                    />
                  </div>
                </div>
                <p className="px-6 pt-4 pb-5 font-semibold">
                  Overview of the Governance Steering Council
                </p>
              </a>
              <a
                href="https://blog.element.fi/an-introduction-to-elements-governance-model/"
                target="_blank"
                rel="noreferrer"
                className="group border border-primary-text-light/20 p-[1px] rounded-2xl bg-[#51466F]/20 hover:border-primary-text-light/50 hover:bg-[#51466F]/40 transition-all"
              >
                <div className="flex items-center justify-center h-44 rounded-t-[15px] overflow-hidden relative">
                  {/* image effects */}
                  {/* <div className="absolute inset-0 shadow-[inset_0_0_40px_currentColor] text-dark opacity-40 transition-all group-hover:opacity-0"></div> */}
                  {/* <div className="absolute inset-0 opacity-50 bg-primary mix-blend-hue group-hover:opacity-0"></div> */}
                  <div className="w-full h-full lg:max-w-none lg:w-auto">
                    <img
                      src="/element-governance-banner.jpg"
                      alt="element governance banner"
                      className="object-cover w-full h-full lg:max-w-none"
                    />
                  </div>
                </div>
                <p className="px-6 pt-4 pb-5 font-semibold">
                  An Introduction to Element’s Governance Model
                </p>
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
