import { useRouter } from "next/router";
import { ReactElement } from "react";

interface StatisticProps {
  label: string;
  value: string;
}
function Statistic({ label, value }: StatisticProps) {
  return (
    <div className="px-4 py-2 bg-gray-200 rounded-md shrink-0">
      <div className="text-gray-500">{label}</div>
      <div className="text-black">{value}</div>
    </div>
  );
}

export default function Vault(): ReactElement {
  const router = useRouter();
  const { address } = router.query;
  return (
    <div className="max-w-5xl m-auto">
      <div className="flex flex-col items-start pl-16 pr-16 mt-16 space-y-6">
        <div className="w-full text-3xl text-left text-white underline">
          Vault Name
        </div>
        <div className="w-full text-left text-white text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </div>

        <div className="flex flex-row flex-wrap space-x-4">
          <Statistic label="active proposals" value="6" />
          <Statistic label="your voting power" value="1,500" />
          <Statistic label="% of total tvp" value="1.4%" />
          <Statistic label="delegated to you" value="2" />
          <Statistic label="participates" value="2,114" />
        </div>

        <div className="grid w-full h-48 grid-cols-2 grid-rows-1 gap-x-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row">
              <div className="mr-4 text-2xl font-bold text-white">Deposit</div>
              <div className="text-2xl text-white">Withdraw</div>
            </div>
            <div className="flex">
              <div className="w-full max-w-xs mr-2 daisy-form-control">
                <input
                  type="text"
                  placeholder="Type here"
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

            <button className="daisy-btn-primary daisy-btn-sm daisy-btn">
              Deposit
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="text-2xl font-bold text-white">Change Delegate</div>

            <div className="flex">
              <div className="w-full max-w-xs mr-2 daisy-form-control">
                <input
                  type="text"
                  placeholder="Type here"
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
            <button className="daisy-btn-primary daisy-btn-sm daisy-btn">
              Delegate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
