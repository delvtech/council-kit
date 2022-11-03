import Statistic from "components/Statistic";
import { ReactElement } from "react";

export default function Vault(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-4xl flex-col items-start gap-y-6 px-8">
      {/* Header */}
      <h1 className="w-full text-3xl text-white underline">Vault Name</h1>
      <p className="w-full text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris
      </p>

      {/* Statistics Row */}
      <div className="flex flex-row flex-wrap gap-4">
        <Statistic label="active proposals" value="6" />
        <Statistic label="your voting power" value="1,500" />
        <Statistic label="% of total tvp" value="1.4%" />
        <Statistic label="delegated to you" value="2" />
        <Statistic label="participants" value="2,114" />
      </div>

      <div className="grid h-48 w-full gap-y-4 sm:grid-cols-2 sm:grid-rows-1 sm:gap-y-0 sm:gap-x-4">
        {/* Deposit/Withdraw Column */}
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row">
            <h2 className="mr-4 text-2xl font-bold text-white">Deposit</h2>
            <h2 className="text-2xl text-white">Withdraw</h2>
          </div>
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
          <button className="daisy-btn-primary daisy-btn">Deposit</button>
        </div>

        {/* Change Delegate Column */}
        <div className="flex flex-col gap-y-4">
          <div className="text-2xl font-bold text-white">Change Delegate</div>
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
          <button className="daisy-btn-primary daisy-btn">Delegate</button>
        </div>
      </div>
    </div>
  );
}
