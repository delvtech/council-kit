import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function ProposalPage(): ReactElement {
  const {
    query: { id },
  } = useRouter();
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      {/* Page Header */}
      <div className="flex w-full flex-wrap items-center gap-4">
        <h1 className="mb-4 whitespace-nowrap text-3xl text-primary-content underline">
          Proposal {id}
        </h1>

        <div className="sm:ml-auto">
          <div className="flex w-full">
            <h3>QUORUM</h3>
            <p className="ml-auto font-bold">500,000 / 1.1m</p>
          </div>
          <progress
            className="flex-end daisy-progress daisy-progress-info w-56"
            value="50"
            max="100"
          ></progress>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="flex flex-wrap gap-4">
        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Voting Contract</div>
            <div className="daisy-stat-value">Core Voting</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Created</div>
            <div className="daisy-stat-value">Nov 10, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="daisy-stat-value">Jan 12, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="daisy-stat-value">Dec 12, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Last Call</div>
            <div className="daisy-stat-value">Feb 12, 2022</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap">
        <div className=" flex basis-[60%] flex-col gap-y-4 border-2 border-red-500 ">
          <div className="grid grid-cols-3">
            <h2>VOTER</h2>
            <h2>VOTING POWER</h2>
            <h2>BALLOT</h2>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="daisy-input-bordered daisy-input-accent daisy-input w-full"
          />

          {/* Data Rows */}
          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>

          <div className="grid grid-cols-3">
            <h2 className="underline">xashd.eth</h2>
            <h2>80,000</h2>
            <h2 className="text-green-400">YES</h2>
          </div>
        </div>

        <div className="basis-[40%] border-2 border-red-500"></div>
      </div>
    </div>
  );
}
