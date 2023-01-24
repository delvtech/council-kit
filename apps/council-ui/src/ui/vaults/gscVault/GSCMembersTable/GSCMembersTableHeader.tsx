import { ReactElement } from "react";

export function GSCMembersTableHeader(): ReactElement {
  return (
    <thead>
      <tr>
        <th className="w-72">Member</th>
        <th>Qualifying Voting Power</th>
        <th>Kick</th>
      </tr>
    </thead>
  );
}
