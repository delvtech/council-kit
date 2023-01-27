import { ReactElement } from "react";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";

export function GSCMembersTableHeader(): ReactElement {
  return (
    <GridTableHeader>
      <span>Member</span>
      <span>Voting Power</span>
      <span>
        <DefinitionTooltip content="GSC Members can be kicked off the GSC if they fall below the voting power threshold.">
          Member Actions
        </DefinitionTooltip>
      </span>
    </GridTableHeader>
  );
}
