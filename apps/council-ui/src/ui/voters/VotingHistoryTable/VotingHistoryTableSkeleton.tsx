import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function VotingHistoryTableSkeleton(): ReactElement {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full md:max-w-3xl daisy-table">
          <thead>
            <tr>
              <th className="w-36">Proposal</th>
              <th className="w-12">Voting Power</th>
              <th className="w-8">Vote</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
