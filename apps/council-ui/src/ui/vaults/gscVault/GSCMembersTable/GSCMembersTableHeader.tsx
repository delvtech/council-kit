import { ReactElement } from "react";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";

export function GSCMembersTableHeader(): ReactElement {
  return (
    <GridTableHeader>
      <span>Member</span>
      <span>
        {/* TODO: Add a tooltip explaing this comes from approved vaults on core voting */}
        Qualifying Voting Power
      </span>
      <span>
        {/* TODO: Add a tooltip explaing what makes a member kickable */}
        Member Actions
      </span>
    </GridTableHeader>
  );
}
