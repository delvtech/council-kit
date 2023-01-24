import { ReactElement } from "react";

export function GSCMembersTableHeader(): ReactElement {
  return (
    <thead>
      <tr>
        <th className="w-72">Member</th>
        <th>
          {/* TODO: Add a tooltip explaing this comes from approved vaults on core voting */}
          Qualifying Voting Power
        </th>
        <th>
          {/* TODO: Add a tooltip explaing what makes a member kickable */}
          Member Actions
        </th>
      </tr>
    </thead>
  );
}
