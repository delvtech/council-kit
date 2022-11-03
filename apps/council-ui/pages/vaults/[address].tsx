import Statistic from "components/Statistic";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Vault(): ReactElement {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div className="max-w-4xl m-auto">
      <div className="flex flex-col items-start px-8 mt-16 space-y-6">
        {/* Header */}
        <div className="w-full text-3xl text-left text-white underline">
          Vault Name
        </div>
        <div className="w-full text-left text-white text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </div>

        {/* Statistics Row */}
        <div className="flex flex-row flex-wrap gap-4">
          <Statistic label="active proposals" value="6" />
          <Statistic label="your voting power" value="1,500" />
          <Statistic label="% of total tvp" value="1.4%" />
          <Statistic label="delegated to you" value="2" />
          <Statistic label="participates" value="2,114" />
        </div>

        <div className="grid w-full h-48 gap-y-4 sm:grid-cols-2 sm:grid-rows-1 sm:gap-y-0 sm:gap-x-4">
          {/* Deposit/Withdraw Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row">
              <div className="mr-4 text-2xl font-bold text-white">Deposit</div>
              <div className="text-2xl text-white">Withdraw</div>
            </div>
            <div className="flex">
              <div className="w-full max-w-xs mr-2 daisy-form-control">
                <input
                  type="text"
                  placeholder="Amount"
                  className="w-full max-w-xs daisy-input-bordered daisy-input"
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
          <div className="flex flex-col space-y-4">
            <div className="text-2xl font-bold text-white">Change Delegate</div>

            <div className="flex">
              <div className="w-full max-w-xs mr-2 daisy-form-control">
                <input
                  type="text"
                  placeholder="Address or ENS"
                  className="w-full max-w-xs daisy-input-bordered daisy-input"
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
    </div>
  );
}
