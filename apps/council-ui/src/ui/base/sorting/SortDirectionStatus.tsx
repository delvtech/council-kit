import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import { SortDirection } from "./sortDirection";

interface SortDirectionStatusProps {
  direction: SortDirection | undefined;
}

export function SortDirectionStatus({
  direction,
}: SortDirectionStatusProps): ReactElement | null {
  switch (direction) {
    case "ASC":
      return <ChevronDoubleUpIcon className="h-4" />;
    case "DESC":
      return <ChevronDoubleDownIcon className="h-4" />;
    default:
      return null;
  }
}
