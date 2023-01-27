import classNames from "classnames";
import { ReactElement, ReactNode, useState } from "react";
import { SortDirectionStatus } from "src/ui/base/sorting/SortDirectionStatus";
import { SortDirection } from "src/ui/base/sorting/types";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRow } from "src/ui/base/tables/GridTableRow";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { UrlObject } from "url";

// Header cells should be uniform, so ReactNodes aren't accepted.
export type Column<K extends string> =
  | string
  | {
      name: string;
      className?: string;
      /**
       * if defined, the column will be sortable
       */
      sortKey?: K;
    };

export type LinkRow = {
  cells: ReactNode[];
  href: string | UrlObject;
};

export type Row = LinkRow | ReactNode[];

interface SortableGridTableProps<K extends string> {
  cols: Column<K>[];
  rows: Row[];
  onSort?: (sortOptions: SortOptions<K>) => void;
  className?: string;
  colRowClassName?: string;
  rowClassName?: string;
}

/**
 * A div with `display: grid` pretending to be a table :).
 * To customize column widths use the `grid-cols-[<col-widths>]` className.
 * @see https://tailwindcss.com/docs/grid-template-columns#using-custom-values
 */
export function SortableGridTable<K extends string>({
  cols,
  rows,
  onSort,
  colRowClassName,
  rowClassName,
}: SortableGridTableProps<K>): ReactElement {
  const [sortKey, setSortKey] = useState<K>();
  const [sortDirection, setSortDirection] = useState<SortDirection>();

  function handleSortChange(key: K) {
    let newDirection: SortDirection;

    if (key === sortKey) {
      newDirection = nextSortDirection(sortDirection);
    } else {
      newDirection = nextSortDirection();
      setSortKey(key);
    }
    setSortDirection(newDirection);

    onSort?.({
      key,
      direction: newDirection,
    });
  }

  return (
    <>
      <GridTableHeader className={colRowClassName}>
        {cols.map((col, i) => {
          if (typeof col === "string") {
            return <span key={i}>{col}</span>;
          }

          if (col.sortKey) {
            return (
              <button
                key={i}
                className={classNames(
                  "text-left flex items-center gap-1 hover:bg-base-300",
                  col.className,
                )}
                // safe to cast since the truthiness has already been checked
                onClick={() => handleSortChange(col.sortKey as K)}
              >
                {col.name}
                {sortKey === col.sortKey && (
                  <SortDirectionStatus direction={sortDirection} />
                )}
              </button>
            );
          }

          return (
            <span key={i} className={col.className}>
              {col.name}
            </span>
          );
        })}
      </GridTableHeader>

      {rows.map((row, i) => {
        if ("href" in row) {
          return (
            <GridTableRowLink key={i} href={row.href} className={rowClassName}>
              {row.cells.map((cell, i) => {
                if (typeof cell !== "object") {
                  return <span key={i}>{cell}</span>;
                }
                return cell;
              })}
            </GridTableRowLink>
          );
        }
        return (
          <GridTableRow key={i} className={rowClassName}>
            {row}
          </GridTableRow>
        );
      })}
    </>
  );
}

export interface SortOptions<K extends string> {
  key?: K;
  direction?: SortDirection;
}

// simple state machine for sort state transitions
function nextSortDirection(
  currentDirection?: SortDirection,
  defaultDirection: SortDirection = "DESC",
): SortDirection {
  const secondDirection = oppositeDirection[defaultDirection];
  switch (currentDirection) {
    case defaultDirection:
      return secondDirection;
    case secondDirection:
      return undefined;
    default:
      return defaultDirection;
  }
}

const oppositeDirection: Record<
  Exclude<SortDirection, undefined>,
  SortDirection
> = {
  ASC: "DESC",
  DESC: "ASC",
};
