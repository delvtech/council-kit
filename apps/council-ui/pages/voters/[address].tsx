import Statistic from "components/Statistic";
import { ReactElement } from "react";

export default function Voters(): ReactElement {
  return (
    <div className="flex flex-col items-start max-w-6xl px-16 m-auto mt-16 gap-y-6">
      {/* Header */}
      <div className="w-full text-3xl text-white">Vitalik.eth</div>
      <div className="w-full text-white underline">0x000...000</div>

      {/* Statistics Row */}
      <div className="flex flex-wrap gap-4">
        <Statistic label="voting power" value="256,173" />
        <Statistic label="% of TVP" value="1,500" />
        <Statistic label="GSC Status" value="Member" />
        <Statistic label="Proposals created" value="2" />
        <Statistic label="Participation grade" value="90%" />
      </div>

      <div className="grid w-full gap-y-8 md:grid-cols-2 md:gap-x-4 md:gap-y-0">
        {/* Deposit/Withdraw Column */}
        <div className="flex flex-col gap-y-4">
          <div className="grid items-center grid-cols-5">
            <p className="">Proposal</p>
            <p className="col-span-2 whitespace-nowrap">Vote Outcome</p>
            <p>Vote</p>
            <p className="whitespace-nowrap">Voting Power</p>
          </div>
          <div className="grid items-center grid-cols-5">
            <p className="text-white underline whitespace-nowrap">
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
                  // style="stroke:rgb(255,0,0);stroke-width:2"
                />
              </svg>
            </div>
            <p className="text-green-500">YES</p>
            <p className="text-white ">100,000</p>
          </div>
        </div>

        {/* Voting Vault Column */}
        <div className="flex flex-col gap-y-4">
          <div className="text-2xl font-bold text-white">Voting Vault (6)</div>
          <div className="flex flex-col overflow-auto h-96 gap-y-4">
            <div className="flex flex-col max-w-xl gap-y-1">
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
