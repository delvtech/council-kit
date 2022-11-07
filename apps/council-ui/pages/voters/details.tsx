import { ReactElement } from "react";

export default function VoterDetailsPage(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-6xl flex-col items-start gap-y-10 px-4">
      {/* Header */}
      <div>
        <div className="w-full text-3xl text-primary-content">Vitalik.eth</div>
        <div className="w-full text-secondary-content underline">
          0x000...000
        </div>
      </div>

      {/* Statistics Row */}
      <div className="flex flex-wrap gap-4">
        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Active Proposals</div>
            <div className="daisy-stat-value">6</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Your Voting Power</div>
            <div className="daisy-stat-value">1,000,000</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">% of Total TVP</div>
            <div className="daisy-stat-value">1.2%</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Delegated to You</div>
            <div className="daisy-stat-value">90</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Participants</div>
            <div className="daisy-stat-value">2.112</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
        {/* Deposit/Withdraw Column */}
        <div className="flex basis-[65%] flex-col gap-y-4">
          <div className="grid grid-cols-5 items-center">
            <p className="">Proposal</p>
            <p className="col-span-2 whitespace-nowrap">Vote Outcome</p>
            <p>Vote</p>
            <p className="whitespace-nowrap">Voting Power</p>
          </div>
          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap text-white underline">
              Proposal #3
            </p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="green"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-white ">100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap text-white underline">
              Proposal #3
            </p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="green"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-primary-content ">100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap text-primary-content underline">
              Proposal #3
            </p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="green"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-primary-content ">100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap text-primary-content underline">
              Proposal #3
            </p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="green"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-primary-content ">100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap text-primary-content underline">
              Proposal #3
            </p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="green"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-primary-content ">100,000</p>
          </div>
        </div>

        {/* Voting Vault Column */}
        <div className="flex basis-[35%] flex-col gap-y-4">
          <div className="text-2xl font-bold text-primary-content">
            Voting Vault (6)
          </div>
          <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
            <div className="flex max-w-xl flex-col gap-y-1">
              <h3 className="font-bold underline">Locking Vault</h3>
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto">6,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Voting Power</p>
                <p className="ml-auto">1,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Current Delegation</p>
                <p className="ml-auto">Self</p>
              </div>
              <div className="flex">
                <p>Wallets Delegated</p>
                <p className="ml-auto underline">12</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h3 className="underline">Locking Vault</h3>
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto">6,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Voting Power</p>
                <p className="ml-auto">1,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Current Delegation</p>
                <p className="ml-auto">Self</p>
              </div>
              <div className="flex">
                <p>Wallets Delegated</p>
                <p className="ml-auto underline">12</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h3 className="underline">Locking Vault</h3>
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto">6,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Voting Power</p>
                <p className="ml-auto">1,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Current Delegation</p>
                <p className="ml-auto">Self</p>
              </div>
              <div className="flex">
                <p>Wallets Delegated</p>
                <p className="ml-auto underline">12</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h3 className="underline">Locking Vault</h3>
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto">6,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Voting Power</p>
                <p className="ml-auto">1,000 ELFI</p>
              </div>
              <div className="flex">
                <p>Current Delegation</p>
                <p className="ml-auto">Self</p>
              </div>
              <div className="flex">
                <p>Wallets Delegated</p>
                <p className="ml-auto underline">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
