import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function VoterVaultsListSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap w-full gap-6 grow-0">
      <div className="flex flex-col grow p-8 md:grow-0 gap-y-4 daisy-card bg-base-300 w-[360px] h-[330px]">
        <h3 className="text-2xl font-semibold underline">
          <Skeleton />
        </h3>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <button className="daisy-btn daisy-btn-primary" disabled={true}>
          Delegate
        </button>
      </div>
      <div className="flex flex-col grow p-8 md:grow-0 gap-y-4 daisy-card bg-base-300 w-[360px] h-[330px]">
        <h3 className="text-2xl font-semibold underline">
          <Skeleton />
        </h3>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <button className="daisy-btn daisy-btn-primary" disabled={true}>
          Delegate
        </button>
      </div>
    </div>
  );
}
