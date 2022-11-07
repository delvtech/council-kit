import { ReactElement } from "react";

export default function Vault(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      {/* Page Header */}
      <div>
        <h1 className="mb-4 text-3xl text-primary-content underline">
          Vault Name
        </h1>
        <p className="text-secondary-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </p>
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

      <div className="grid h-48 w-full gap-y-10 sm:grid-cols-2 sm:grid-rows-1 sm:gap-y-0 sm:gap-x-8">
        {/* Deposit/Withdraw Column */}
        <div className="flex flex-col gap-y-4">
          {/* Actions Headers */}
          <div className="flex gap-x-4">
            <h2 className="text-2xl font-bold text-primary-content">Deposit</h2>
            <h2 className="text-2xl text-primary-content">Withdraw</h2>
          </div>

          {/* Token Amount Input */}
          <div className="flex">
            <div className="daisy-form-control mr-2 w-full max-w-xs">
              <input
                type="text"
                placeholder="Amount"
                className="daisy-input-bordered daisy-input w-full max-w-xs"
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
          <button className="daisy-btn-secondary daisy-btn">Deposit</button>
        </div>

        {/* Change Delegate Column */}
        <div className="flex flex-col gap-y-4">
          {/* Actions Headers */}
          <div className="text-2xl font-bold text-primary-content">
            Change Delegate
          </div>

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
          <button className="daisy-btn-secondary daisy-btn">Delegate</button>
        </div>
      </div>
    </div>
  );
}
