import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function VotingActivityTableSkeleton(): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <table className="w-full daisy-table-zebra daisy-table">
        <thead>
          <tr>
            <th className="w-72">Voter</th>

            <th>
              <span className="mr-1">Voting Power</span>
            </th>

            <th>Ballot</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
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
  );
}
