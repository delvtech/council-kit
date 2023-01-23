import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

export function ProposalsTableSkeleton(): ReactElement {
  return (
    <table className="w-full shadow-md daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th className="w-72">Name</th>

          <th className="w-32">Voting Ends</th>

          <th className="w-32">
            <span className="mr-1">Quorum</span>
          </th>

          <th className="w-16">Your Ballot</th>

          <th className="w-16"></th>
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
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
