export type SortDirection = "ASC" | "DESC";

// simple state machine for sort state transitions
export function toggleSortDirection(
  currentDirection: SortDirection | undefined,
  primarySortDirection: SortDirection = "DESC",
): SortDirection | undefined {
  const secondarySortDirection = oppositeDirection[primarySortDirection];
  switch (currentDirection) {
    case primarySortDirection:
      return secondarySortDirection;
    case secondarySortDirection:
      return undefined;
    default:
      return primarySortDirection;
  }
}

const oppositeDirection: Record<SortDirection, SortDirection> = {
  ASC: "DESC",
  DESC: "ASC",
};
