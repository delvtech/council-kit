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
            className="flex-end shrink-1 daisy-progress daisy-progress-info w-48 sm:w-64"
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
            <div className="daisy-stat-value text-sm">Core Voting</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Created</div>
            <div className="daisy-stat-value text-sm">Nov 10, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="daisy-stat-value text-sm">Jan 12, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="daisy-stat-value text-sm">Dec 12, 2022</div>
          </div>
        </div>

        <div className="daisy-stats">
          <div className="daisy-stat bg-primary text-primary-content">
            <div className="daisy-stat-title">Last Call</div>
            <div className="daisy-stat-value text-sm">Feb 12, 2022</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-10 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          <h1 className="text-xl text-primary-content">Voting Activity</h1>
          <div className="grid grid-cols-3">
            <h2 className="text-secondary-content">Voter</h2>
            <h2 className="text-secondary-content">Voting Power</h2>
            <h2 className="text-secondary-content">Ballot</h2>
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

        <div className="grow basis-[300px] md:grow-0">
          <div className="flex flex-col gap-y-4">
            <h2 className="text-xl text-primary-content">Your Vote</h2>
            <div className="flex">
              <h3 className="">Vaults</h3>
              <h3 className="ml-auto">Voting Power</h3>
            </div>
            <div className="flex max-h-64 flex-col gap-y-3 overflow-y-auto pr-8">
              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>

              <div className="flex">
                <h3 className="underline">Locking Vault</h3>
                <h3 className="ml-auto">50,000</h3>
              </div>
            </div>

            <div className="flex">
              <h2 className="text-lg text-secondary-content">
                Total Voting Power
              </h2>
              <h2 className="ml-auto text-lg font-bold text-primary-content">
                200,000
              </h2>
            </div>

            <div className="daisy-btn-group m-auto">
              <button className="daisy-btn-active daisy-btn-lg daisy-btn">
                YES
              </button>
              <button className="daisy-btn-lg daisy-btn">NO</button>
              <button className="daisy-btn-lg daisy-btn">ABSTAIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
