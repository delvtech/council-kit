import { Page } from "components/base/Page";
import { ReactElement } from "react";

export default function Vault(): ReactElement {
  return (
    <Page>
      {/* Page Header */}
      <div>
        <h1 className="text-5xl text-accent-content underline">
          Locking Vault
        </h1>
        <p className="mt-6">
          The Locking vault allows users to deposit their tokens into a contract
          in exchange for voting power, which can also be delegated to a
          different user. The vault tracks the historical voting power of each
          address and, when asked for voting power, searches the historical
          record of that address’ voting power at the time when the vote was
          proposed.
        </p>
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
      <div className="flex h-48 w-full flex-col gap-x-8 sm:flex-row">
        {/* Deposit/Withdraw Column */}
        <div className="flex basis-1/2 flex-col gap-y-4">
          {/* Actions Headers */}
          <div className="flex gap-x-4">
            <h2 className="text-2xl font-extrabold">Deposit</h2>
            <h2 className="text-2xl">Withdraw</h2>
          </div>

          {/* Token Amount Input */}
          <div className="flex">
            <div className="daisy-form-control mr-2 w-full">
              <input
                type="text"
                placeholder="Amount"
                className="daisy-input-bordered daisy-input w-full"
              />
              <label className="daisy-label">
                <span className="daisy-label-text-alt">
                  Balance: 12,000 ELFI
                </span>
              </label>
            </div>
            <button className="daisy-btn-outline daisy-btn">Max</button>
          </div>

          {/* Action Submit Button */}
          <button className="daisy-btn daisy-btn-primary">Deposit</button>
        </div>

        {/* Change Delegate Column */}
        <div className="flex basis-1/2 flex-col gap-y-4">
          {/* Actions Headers */}
          <div className="text-2xl font-bold">Change Delegate</div>

          {/* Delegate Address Input */}
          <div className="flex">
            <div className="daisy-form-control mr-2 w-full max-w-xs">
              <input
                type="text"
                placeholder="Address or ENS"
                className="daisy-input-bordered daisy-input w-full max-w-xs"
              />
              <label className="daisy-label">
                <span className="daisy-label-text-alt">
                  Current Delegate: vitalik.eth
                </span>
              </label>
            </div>
            <button className="daisy-btn-outline daisy-btn">Max</button>
          </div>

          {/* Action Submit Button */}
          <button className="daisy-btn daisy-btn-primary">Delegate</button>
        </div>
      </div>
    </Page>
  );
}
