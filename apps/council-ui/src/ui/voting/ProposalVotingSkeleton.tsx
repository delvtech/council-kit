import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function ProposalVotingSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex">
        <h3 className="text-lg font-medium">Vaults</h3>
        <h3 className="ml-auto text-lg font-medium">Voting Power</h3>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-64 gap-y-4">
        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>
      </div>

      <div className="flex">
        <h2 className="text-lg">Total Voting Power</h2>
        <p className="ml-auto text-lg font-bold">
          <Skeleton />
        </p>
      </div>

      <div className="m-auto daisy-btn-group">
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          YES
        </button>
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          NO
        </button>
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          ABSTAIN
        </button>
      </div>
    </div>
  );
}
