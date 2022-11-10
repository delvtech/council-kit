import { Container } from "components/base/Container";
import { ReactElement } from "react";

export default function VoterDetailsPage(): ReactElement {
  return (
    <Container>
      {" "}
      {/* Header */}
      <div>
        <h1 className="w-full text-5xl">Vitalik.eth</h1>
        <h2 className="mt-2 w-full text-2xl underline">0x000...000</h2>
      </div>
      {/* Statistics Row */}
      <div className="flex flex-wrap gap-4">
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Active Proposals</div>
            <div className="daisy-stat-value text-sm">6</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Your Voting Power</div>
            <div className="daisy-stat-value text-sm">1,000,000</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">% of Total TVP</div>
            <div className="daisy-stat-value text-sm">1.2%</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Delegated to You</div>
            <div className="daisy-stat-value text-sm">90</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Participants</div>
            <div className="daisy-stat-value text-sm">2.112</div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
        {/* Deposit/Withdraw Column */}
        <div className="flex min-w-[500px] flex-col gap-y-4 sm:basis-[65%]">
          <h2 className="text-2xl font-bold">Voting History</h2>
          <div className="grid grid-cols-5 items-center">
            <p>Proposal</p>
            <p className="col-span-2 whitespace-nowrap">Vote Outcome</p>
            <p>Vote</p>
            <p className="whitespace-nowrap">Voting Power</p>
          </div>
          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap underline">Proposal #3</p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="60%"
                  y1="0"
                  x2="100%"
                  y2="0"
                  className="stroke-red-500"
                  strokeWidth={10}
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="60%"
                  y2="0"
                  className="stroke-neutral"
                  strokeWidth={10}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="50%"
                  y2="0"
                  className="stroke-green-500"
                  strokeWidth={10}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p>100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap underline">Proposal #3</p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="60%"
                  y1="0"
                  x2="100%"
                  y2="0"
                  className="stroke-red-500"
                  strokeWidth={10}
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="60%"
                  y2="0"
                  className="stroke-neutral"
                  strokeWidth={10}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="50%"
                  y2="0"
                  className="stroke-green-500"
                  strokeWidth={10}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p>100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap underline">Proposal #3</p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="60%"
                  y1="0"
                  x2="100%"
                  y2="0"
                  className="stroke-red-500"
                  strokeWidth={10}
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="60%"
                  y2="0"
                  className="stroke-neutral"
                  strokeWidth={10}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="50%"
                  y2="0"
                  className="stroke-green-500"
                  strokeWidth={10}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p>100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap underline">Proposal #3</p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="60%"
                  y1="0"
                  x2="100%"
                  y2="0"
                  className="stroke-red-500"
                  strokeWidth={10}
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="60%"
                  y2="0"
                  className="stroke-neutral"
                  strokeWidth={10}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="50%"
                  y2="0"
                  className="stroke-green-500"
                  strokeWidth={10}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p>100,000</p>
          </div>

          <div className="grid grid-cols-5 items-center">
            <p className="whitespace-nowrap underline">Proposal #3</p>
            <div className="col-span-2 pr-4">
              <svg height="10" width="100%">
                <line
                  x1="60%"
                  y1="0"
                  x2="100%"
                  y2="0"
                  className="stroke-red-500"
                  strokeWidth={10}
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="60%"
                  y2="0"
                  className="stroke-neutral"
                  strokeWidth={10}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="50%"
                  y2="0"
                  className="stroke-green-500"
                  strokeWidth={10}
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p>100,000</p>
          </div>
        </div>

        {/* Voting Vault Column */}
        <div className="flex flex-col gap-y-4 sm:basis-[35%]">
          <div className="text-2xl font-bold">Voting Vault (6)</div>
          <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
            <div className="flex flex-col gap-y-1">
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

            <div>
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

            <div>
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

            <div>
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
    </Container>
  );
}
