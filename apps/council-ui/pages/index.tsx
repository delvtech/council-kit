import Link from "next/link";
import { ReactElement } from "react";

export default function Index(): ReactElement {
  return (
    <div className="m-auto">
      <div className="flex flex-col max-w-5xl md:-24 p-8 m-auto gap-y-8">
        <h1 className="text-5xl font-bold text-accent-content">
          <span className="text-accent">Fund AI Training DAO</span> is a DAO for
          crowdsourcing training of large AI models.
        </h1>
        <div className="space-x-4">
          <Link href="/proposals">
            <button className="daisy-btn daisy-btn-accent">Open App</button>
          </Link>
          <a
            href="https://github.com/ethWaterloo23-fundAiTrainingDao/fundAiTrainingDao"
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
            <div className="text-4xl text-center">
              Powerful AI models should be a public good, just like Linux,
              Ethereum, and academic research on AI
            </div>
            <div className="text-2xl text-center">
              A crypto community should be able to download and self-host an AI
              model to run a support or educational chatbot or audit a contract
              without being constrained by licenses, biased fine-tuning, and
              data sharing.
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:p-24 p-8">
        <div className="max-w-5xl m-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="text-2xl text-center">
              Our new type of DAO allows us to crowdsource and manage the
              multi-stage process of creating large AI models. We showcase the
              value of crowdfunded AI with its ability to find bugs in solidity
              contracts. The communication with the AI model and between the
              members is privacy-preserving and anonymous -- no IP or DNS.
            </div>
            <div className="flex flex-col max-w-md gap-4">
              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">DAO</h2>
                  <p>
                    The DAO has a governance vault for voting and multiple
                    funding vaults to raise capital. The proposals in the
                    governance vault create funding vaults. Funding vaults can
                    be used for gathering data, cleaning the data, pre-training,
                    fine-tuning, RLHF, and even hosting. Donors contribute to
                    the funding vault, for example, for GPU compute to pre-train
                    an LLM and, in return, get votes for the governance vault.
                    Users can use the UI to delegate, vote, act on proposals,
                    chat, and use the trained AI. The fund vault allows deposits
                    and withdraws until the total amount reaches a threshold;
                    after, the fund is locked, and the funds will be sent to an
                    address to execute on the proposal, such as pre-training of
                    LLM. We inherit from delv-council&apos;s vault contracts
                    with additional functionality.
                  </p>
                </div>
              </div>

              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Safe communication</h2>
                  <p>
                    Voters can communicate with each other just by knowing each
                    other&apos;s wallet addresses making the decision process
                    privacy-preserving, unbiased, and resilient to corruption
                    and coalitions. We make a group chat from a p2p chat (XMTP)
                    by sending the message to all recipients.
                  </p>
                </div>
              </div>

              <div className="daisy-card bg-neutral text-neutral-content">
                <div className="daisy-card-body">
                  <h2 className="daisy-card-title">Powerful AI</h2>
                  <p>
                    For our showcase, we trained the AI on existing
                    vulnerabilities presented by Quantstamp and Slither&apos;s
                    vulnerability list. The training uses HuggingFace&apos;s
                    sentence_transformer to generate 384-dimensional vector
                    embedding. The AI audit of the solidity code looks for
                    similarities to known vulnerability patterns and returns the
                    top 3 matches.
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
            <h2 className="text-4xl font-medium">🤝 Team 🤝 </h2>
            <img
              alt="yearn logo"
              height={80}
              width={80}
              src="https://cryptologos.cc/logos/yearn-finance-yfi-logo.png"
            />

            <div className="flex flex-wrap justify-center gap-6">
              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center text-center daisy-card-body">
                  <h2 className="daisy-card-title">Kirill</h2>
                </div>
              </div>
              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center daisy-card-body">
                  <h2 className="daisy-card-title">Aziz</h2>
                </div>
              </div>

              <div className="w-48 daisy-card bg-neutral text-neutral-content">
                <div className="items-center daisy-card-body">
                  <h2 className="daisy-card-title">Jason</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
