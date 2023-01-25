import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { GSCMembersTableHeader } from "./GSCMembersTableHeader";

export function GSCMembersTableSkeleton(): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <table className="w-full daisy-table-zebra daisy-table">
        <GSCMembersTableHeader />

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
  );
}
